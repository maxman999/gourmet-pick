package com.kjy.gourmetpick.web;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
public class IndexController {

    @RequestMapping("/")
    public String index(){
        return "index";
    }
}
