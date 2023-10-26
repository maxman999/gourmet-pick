package com.kjy.gourmet.utils;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;

import java.util.Random;

public class TestUtils {

    static Random random = new Random();

    public static User getDummyUser() {
        return User.builder()
                .email("test" + random.nextInt(100000) + "@test.com")
                .nickname("냉정한 미식가")
                .role(Role.USER)
                .build();
    }

    public static Room getDummyRoom(long managerId) {
        return Room.builder()
                .name(random.nextInt(100000) + "번방")
                .invitationCode(AuthUtil.generateInviteCode(10))
                .managerId(managerId)
                .build();
    }

    public static Menu getDummyMenu(long roomId, long writerId) {
        return Menu.builder()
                .roomId(roomId)
                .name(random.nextInt(100000) + "번메뉴")
                .thumbnail("dummyURL")
                .soberComment("dummyComment")
                .placeName("dummyPlaceName")
                .roadAddressName("dummyRoadAddressName")
                .latitude(123.12345)
                .longitude(123.1234)
                .writerId(writerId)
                .build();
    }


}
