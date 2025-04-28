package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 通知查询参数DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "通知公告查询参数")
public class NotificationQueryDTO {

    @ApiModelProperty("标题关键字")
    private String keyword;
    
    @ApiModelProperty("通知类型")
    private Integer type;
    
    @ApiModelProperty("通知范围")
    private Integer scope;
    
    @ApiModelProperty("状态")
    private String status;
    
    @ApiModelProperty("创建人ID")
    private String creatorId;
    
    @ApiModelProperty("是否置顶")
    private Boolean pinned;
    
    @ApiModelProperty("是否需要确认")
    private Boolean needConfirmation;
    
    @ApiModelProperty("开始日期")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @ApiModelProperty("结束日期")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    @ApiModelProperty("是否已归档")
    private Boolean archived;
    
    @ApiModelProperty("是否已发布")
    private Boolean published;
    
    @ApiModelProperty("是否在回收站")
    private Boolean inRecycleBin;
} 