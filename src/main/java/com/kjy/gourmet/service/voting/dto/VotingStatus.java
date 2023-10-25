package com.kjy.gourmet.service.voting.dto;

public enum VotingStatus {
    CREATE, // 투표 세션 생성
    SEATING, // 투표방 입장
    SYNC, // 방 상태 동기화
    CANCEL, // 투표 강제 취소
    READY, // 투표 진행 가능
    START, // 투표 시작
    FINISH, // 투표 종료
    EXILE, // 도중에 방 삭제됨
    DISCONNECT, // 웹소켓 연결 끊어짐
    DENIED, // 방 접근 불가
    FAIL, // 투표 실패
}
