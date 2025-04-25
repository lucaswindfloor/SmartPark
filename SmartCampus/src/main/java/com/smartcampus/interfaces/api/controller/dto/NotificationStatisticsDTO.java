package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * 通知公告统计数据DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "通知公告统计数据")
public class NotificationStatisticsDTO {

    @ApiModelProperty("ID")
    private Long id;
    
    @ApiModelProperty("标题")
    private String title;
    
    @ApiModelProperty("发布时间")
    private String publishTime;
    
    @ApiModelProperty("发布人")
    private String publisherName;
    
    @ApiModelProperty("总接收人数")
    private Integer totalRecipients;
    
    @ApiModelProperty("已读人数")
    private Integer viewedCount;
    
    @ApiModelProperty("未读人数")
    private Integer unviewedCount;
    
    @ApiModelProperty("已确认人数")
    private Integer confirmedCount;
    
    @ApiModelProperty("未确认人数")
    private Integer unconfirmedCount;
    
    @ApiModelProperty("阅读率")
    private String viewRate;
    
    @ApiModelProperty("确认率")
    private String confirmRate;
    
    @ApiModelProperty("部门统计")
    private List<Map<String, Object>> deptStatistics;
    
    @ApiModelProperty("每日阅读趋势")
    private List<Map<String, Object>> dailyViewTrend;
} 