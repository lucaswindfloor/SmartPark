import { Client } from 'figma-js';
import axios from 'axios';

/**
 * Figma API service for interacting with Figma design files.
 * Requires a personal access token from Figma.
 */
class FigmaService {
  private client: any;

  /**
   * Initialize the Figma API client with an access token.
   * @param token - Figma personal access token
   */
  constructor(token?: string) {
    if (token) {
      this.initialize(token);
    }
  }

  /**
   * Initialize or reinitialize the Figma client with a token.
   * @param token - Figma personal access token
   */
  public initialize(token: string): void {
    this.client = Client({ personalAccessToken: token });
  }

  /**
   * Get a Figma file by its ID.
   * @param fileId - The Figma file ID (from the URL)
   */
  public async getFile(fileId: string) {
    if (!this.client) {
      throw new Error('Figma client is not initialized. Please call initialize() with a valid token.');
    }
    
    try {
      const response = await this.client.file(fileId);
      return response.data;
    } catch (error) {
      console.error('Error fetching Figma file:', error);
      throw error;
    }
  }

  /**
   * Get image URLs for nodes in a file.
   * @param fileId - The Figma file ID
   * @param nodeIds - Array of node IDs to export
   * @param format - Image format (png, jpg, svg, pdf)
   * @param scale - Image scale (1, 2, 3, 4)
   */
  public async getImageUrls(fileId: string, nodeIds: string[], format: 'png' | 'jpg' | 'svg' | 'pdf' = 'png', scale: number = 1) {
    if (!this.client) {
      throw new Error('Figma client is not initialized. Please call initialize() with a valid token.');
    }
    
    try {
      const response = await this.client.fileImages(fileId, {
        ids: nodeIds,
        format,
        scale
      });
      
      return response.data.images;
    } catch (error) {
      console.error('Error fetching Figma images:', error);
      throw error;
    }
  }

  /**
   * Download an image from a Figma image URL.
   * @param imageUrl - The URL of the image to download
   */
  public async downloadImage(imageUrl: string) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Get comments for a file.
   * @param fileId - The Figma file ID
   */
  public async getComments(fileId: string) {
    if (!this.client) {
      throw new Error('Figma client is not initialized. Please call initialize() with a valid token.');
    }
    
    try {
      const response = await this.client.fileComments(fileId);
      return response.data.comments;
    } catch (error) {
      console.error('Error fetching Figma comments:', error);
      throw error;
    }
  }

  /**
   * Post a comment on a file.
   * @param fileId - The Figma file ID
   * @param message - The comment message
   * @param clientMeta - Optional client metadata for the comment positioning
   */
  public async postComment(fileId: string, message: string, clientMeta?: any) {
    if (!this.client) {
      throw new Error('Figma client is not initialized. Please call initialize() with a valid token.');
    }
    
    try {
      const response = await this.client.postComment(fileId, {
        message,
        client_meta: clientMeta
      });
      
      return response.data;
    } catch (error) {
      console.error('Error posting Figma comment:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const figmaService = new FigmaService();

export default figmaService; 