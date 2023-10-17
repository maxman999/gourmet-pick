package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@RequiredArgsConstructor
@Controller
public class IndexController {

    private final UserService userService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @ResponseBody
    @GetMapping("/getAuthenticatedUserId")
    public long getAuthenticatedUserId(@AuthenticationPrincipal OAuth2User oAuth2User) {
        if (oAuth2User == null) return 0;
        return userService.getUserByEmail(oAuth2User.getAttribute("email")).getId();
    }
}
