package com.smartcampus.interfaces.api.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 发布请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "发布请求参数")
public class PublishRequest {

    @ApiModelProperty(value = "生效时间", required = true)
    @NotNull(message = "生效时间不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime effectiveTime;
    
    @ApiModelProperty(value = "过期时间", required = true)
    @NotNull(message = "过期时间不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryTime;
    
    @ApiModelProperty("是否需要确认")
    private Boolean needConfirmation;
    
    @ApiModelProperty("确认截止时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime confirmDeadline;
    
    @ApiModelProperty("是否置顶")
    private Boolean pinned;
} 