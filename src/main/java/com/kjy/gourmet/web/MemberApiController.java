package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RequestMapping("/api/member")
@RequiredArgsConstructor
@RestController
public class MemberApiController {

    private final MemberService memberService;

    @PostMapping("/signUp")
    public int signUp(@RequestBody Member member){
        return memberService.signUp(member);
    }

    @PostMapping("/signIn")
    public long signIn(@RequestBody Member member, HttpServletRequest request){
        long memNo = memberService.getMemberIdAfterValidation(member);
        if(memNo > 0) {
            HttpSession session = request.getSession();
            session.setAttribute("userEmail", member.getEmail());
        }
        return memNo;
    }

    @DeleteMapping("/{memberId}")
    public int signOut(@PathVariable("memberId") Long memberId){
        return memberService.signOut(memberId);
    }

    @GetMapping("/{memberId}")
    public Member member(@PathVariable("memberId") Long memberId){
        return memberService.getMemberById(memberId);
    }

}
