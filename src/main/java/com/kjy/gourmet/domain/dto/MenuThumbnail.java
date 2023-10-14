package com.kjy.gourmet.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Data
@AllArgsConstructor
public class MenuThumbnail {
    private String uuid;
    private String folderPath;
    private String extension;

    public String getThumbnailURL() {
        return URLEncoder.encode(folderPath + "/" + uuid + "." + extension, StandardCharsets.UTF_8);
    }
}
