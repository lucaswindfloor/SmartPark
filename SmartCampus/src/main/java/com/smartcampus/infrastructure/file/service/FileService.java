package com.smartcampus.infrastructure.file.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * 文件服务接口
 */
public interface FileService {

    /**
     * 上传文件
     *
     * @param file 文件
     * @param path 存储路径 (optional, can be generated internally)
     * @return 文件访问URL
     * @throws Exception 上传异常
     */
    String uploadFile(MultipartFile file, String path) throws Exception;

    /**
     * 上传文件
     *
     * @param inputStream 文件流
     * @param path        存储路径
     * @param filename    原始文件名
     * @return 文件访问URL
     * @throws Exception 上传异常
     */
    String uploadFile(InputStream inputStream, String path, String filename) throws Exception;

    /**
     * 删除文件
     *
     * @param fileUrl 文件URL
     * @throws Exception 删除异常
     */
    void deleteFile(String fileUrl) throws Exception;

} 