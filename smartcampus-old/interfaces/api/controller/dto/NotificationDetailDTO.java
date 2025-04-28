package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 通知公告详情DTO
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ApiModel(description = "通知公告详情")
public class NotificationDetailDTO extends NotificationDTO {

    @ApiModelProperty("是否已读")
    private Boolean viewed;
    
    @ApiModelProperty("是否已确认")
    private Boolean confirmed;
    
    @ApiModelProperty("浏览时间")
    private LocalDateTime viewTime;
    
    @ApiModelProperty("确认时间")
    private LocalDateTime confirmTime;
    
    @ApiModelProperty("操作历史记录")
    private List<NotificationHistoryDTO> history;
    
    @ApiModelProperty("已阅读用户信息")
    private List<Map<String, Object>> viewedUsers;
    
    @ApiModelProperty("已确认用户信息")
    private List<Map<String, Object>> confirmedUsers;
    
    @ApiModelProperty("部门阅读统计")
    private List<Map<String, Object>> deptStatistics;
} 