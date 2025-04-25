package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 通知公告操作历史DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "通知公告操作历史")
public class NotificationHistoryDTO {

    @ApiModelProperty("ID")
    private Long id;
    
    @ApiModelProperty("通知ID")
    private Long notificationId;
    
    @ApiModelProperty("操作类型")
    private String operationType;
    
    @ApiModelProperty("操作描述")
    private String operationDesc;
    
    @ApiModelProperty("操作人ID")
    private String operatorId;
    
    @ApiModelProperty("操作人姓名")
    private String operatorName;
    
    @ApiModelProperty("操作时间")
    private LocalDateTime operationTime;
    
    @ApiModelProperty("操作内容")
    private String operationContent;
    
    @ApiModelProperty("备注")
    private String remark;
} 