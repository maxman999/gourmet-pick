package com.kjy.gourmet.domain.menu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Menu {
    private long id;
    private long roomId;
    private String name;
    private String thumbnail;
    private String soberComment;
    private double longitude;
    private double latitude;
}
