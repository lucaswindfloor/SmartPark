package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * 审核请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "审核请求参数")
public class AuditRequest {

    @ApiModelProperty(value = "审核结果", required = true)
    @NotNull(message = "审核结果不能为空")
    private Boolean approved;
    
    @ApiModelProperty("审核意见")
    private String comment;
} 