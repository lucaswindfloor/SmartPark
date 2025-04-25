package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 附件DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "附件信息")
public class AttachmentDTO {

    @ApiModelProperty("ID")
    private Long id;
    
    @ApiModelProperty("文件名")
    private String fileName;
    
    @ApiModelProperty("原始文件名")
    private String originalFileName;
    
    @ApiModelProperty("文件路径")
    private String filePath;
    
    @ApiModelProperty("文件大小(字节)")
    private Long fileSize;
    
    @ApiModelProperty("文件类型")
    private String fileType;
    
    @ApiModelProperty("上传时间")
    private String uploadTime;
    
    @ApiModelProperty("上传人ID")
    private String uploaderId;
    
    @ApiModelProperty("上传人姓名")
    private String uploaderName;
    
    @ApiModelProperty("下载次数")
    private Integer downloadCount;
} 