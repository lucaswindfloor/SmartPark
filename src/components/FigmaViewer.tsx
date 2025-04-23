import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Spin, message, Typography, Space, Modal } from 'antd';
import figmaService from '../services/figma';

const { Title, Text } = Typography;

interface FigmaViewerProps {
  fileId?: string;
  token?: string;
  startNodeId?: string;
  showControls?: boolean;
  width?: string | number;
  height?: string | number;
}

/**
 * FigmaViewer component for embedding Figma designs in your application
 */
const FigmaViewer: React.FC<FigmaViewerProps> = ({
  fileId: initialFileId = '',
  token: initialToken = '',
  startNodeId = '',
  showControls = true,
  width = '100%',
  height = 600
}) => {
  const [fileId, setFileId] = useState<string>(initialFileId);
  const [token, setToken] = useState<string>(initialToken);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(!!initialToken);
  const [nodeId, setNodeId] = useState<string>(startNodeId);
  const [images, setImages] = useState<{[key: string]: string}>({});
  const [fileData, setFileData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  
  const embedUrl = fileId && `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileId}${nodeId ? `?node-id=${nodeId}` : ''}`;

  // Initialize Figma service when token is provided
  useEffect(() => {
    if (initialToken) {
      figmaService.initialize(initialToken);
      setInitialized(true);
    }
  }, [initialToken]);

  // Handle token submission
  const handleTokenSubmit = () => {
    if (!token.trim()) {
      message.error('Please enter a valid Figma access token');
      return;
    }
    
    figmaService.initialize(token);
    setInitialized(true);
    message.success('Figma API token initialized');
  };

  // Load Figma file
  const handleLoadFile = async () => {
    if (!fileId.trim()) {
      message.error('Please enter a valid Figma file ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await figmaService.getFile(fileId);
      setFileData(data);
      message.success('Figma file loaded successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to load Figma file');
      message.error('Error loading Figma file');
    } finally {
      setLoading(false);
    }
  };

  // Export image from node
  const exportNode = async (nodeId: string) => {
    if (!fileId || !nodeId) return;
    
    setLoading(true);
    try {
      const imageUrls = await figmaService.getImageUrls(fileId, [nodeId]);
      setImages(prev => ({ ...prev, [nodeId]: imageUrls[nodeId] }));
    } catch (err: any) {
      message.error(`Failed to export node: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show file structure modal
  const showFileStructure = () => {
    if (!fileData) {
      message.info('Please load a file first');
      return;
    }
    
    setModalVisible(true);
  };
  
  // Handle node click in file structure
  const handleNodeClick = (id: string) => {
    setNodeId(id);
    setModalVisible(false);
  };

  // Render file structure tree recursively
  const renderFileStructure = (node: any, level = 0) => {
    if (!node) return null;
    
    return (
      <div key={node.id} style={{ marginLeft: level * 16, marginBottom: 8 }}>
        <Button 
          type="link" 
          onClick={() => handleNodeClick(node.id)}
          style={{ textAlign: 'left', paddingLeft: 0 }}
        >
          {node.name || node.id} ({node.type})
        </Button>
        
        {node.children && node.children.map((child: any) => 
          renderFileStructure(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="figma-viewer">
      {showControls && (
        <Card style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {!initialized && (
              <div>
                <Text>Enter your Figma personal access token:</Text>
                <Space style={{ marginTop: 8 }}>
                  <Input.Password
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Figma personal access token"
                    style={{ width: 300 }}
                  />
                  <Button type="primary" onClick={handleTokenSubmit}>
                    Initialize
                  </Button>
                </Space>
                <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                  Get your token from Figma: Account Settings &gt; Personal Access Tokens
                </Text>
              </div>
            )}
            
            {initialized && (
              <>
                <div>
                  <Text>Figma File ID:</Text>
                  <Space style={{ marginTop: 8 }}>
                    <Input
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      placeholder="Enter Figma file ID (from URL)"
                      style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={handleLoadFile} loading={loading}>
                      Load File
                    </Button>
                    {fileData && (
                      <Button onClick={showFileStructure}>
                        View File Structure
                      </Button>
                    )}
                  </Space>
                  <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    The file ID is found in the Figma URL after /file/
                  </Text>
                </div>
                
                {fileData && (
                  <div>
                    <Text strong>File: {fileData.name}</Text>
                  </div>
                )}
              </>
            )}
          </Space>
        </Card>
      )}
      
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          Error: {error}
        </div>
      )}
      
      {embedUrl && (
        <div style={{ width, height }}>
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            allowFullScreen
            style={{ border: 'none', borderRadius: 4 }}
            title="Figma Embed"
          />
        </div>
      )}
      
      <Modal
        title="File Structure"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {fileData && renderFileStructure(fileData.document)}
        </div>
      </Modal>
    </div>
  );
};

export default FigmaViewer; 