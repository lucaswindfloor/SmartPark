package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知公告DTO
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "通知公告")
public class NotificationDTO {

    @ApiModelProperty("ID")
    private Long id;
    
    @ApiModelProperty(value = "标题", required = true)
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题长度不能超过100个字符")
    private String title;
    
    @ApiModelProperty(value = "内容", required = true)
    @NotBlank(message = "内容不能为空")
    private String content;
    
    @ApiModelProperty(value = "通知类型", required = true)
    @NotNull(message = "通知类型不能为空")
    private Integer type;
    
    @ApiModelProperty(value = "通知范围", required = true)
    @NotNull(message = "通知范围不能为空")
    private Integer scope;
    
    @ApiModelProperty("接收组织/部门列表")
    private List<String> targetDepts;
    
    @ApiModelProperty("接收用户列表")
    private List<String> targetUsers;
    
    @ApiModelProperty("是否需要确认")
    private Boolean needConfirmation;
    
    @ApiModelProperty("确认截止时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime confirmDeadline;
    
    @ApiModelProperty("状态")
    private Integer status;
    
    @ApiModelProperty("是否置顶")
    private Boolean pinned;
    
    @ApiModelProperty("置顶排序")
    private Integer pinOrder;
    
    @ApiModelProperty("生效时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime effectiveTime;
    
    @ApiModelProperty("过期时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryTime;
    
    @ApiModelProperty("是否已归档")
    private Boolean archived;
    
    @ApiModelProperty("归档时间")
    private LocalDateTime archiveTime;
    
    @ApiModelProperty("归档原因")
    private String archiveReason;
    
    @ApiModelProperty("创建人ID")
    private String creatorId;
    
    @ApiModelProperty("创建人姓名")
    private String creatorName;
    
    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;
    
    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;
    
    @ApiModelProperty("审核人ID")
    private String auditorId;
    
    @ApiModelProperty("审核人姓名")
    private String auditorName;
    
    @ApiModelProperty("审核时间")
    private LocalDateTime auditTime;
    
    @ApiModelProperty("审核意见")
    private String auditComment;
    
    @ApiModelProperty("发布人ID")
    private String publisherId;
    
    @ApiModelProperty("发布人姓名")
    private String publisherName;
    
    @ApiModelProperty("发布时间")
    private LocalDateTime publishTime;
    
    @ApiModelProperty("取消发布原因")
    private String cancelReason;
    
    @ApiModelProperty("浏览次数")
    private Integer viewCount;
    
    @ApiModelProperty("确认次数")
    private Integer confirmCount;
    
    @ApiModelProperty("附件列表")
    private List<AttachmentDTO> attachments;
    
    @ApiModelProperty("标签列表")
    private List<String> tags;
    
    @ApiModelProperty("是否在回收站")
    private Boolean inRecycleBin;
} 