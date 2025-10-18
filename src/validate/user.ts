import { assert, type Infer, number, object, string } from "superstruct";

const User = object({
      id: number(),
      email: string(),
      name: string(),
});

type UserInfer = Infer<typeof User>;

function isUser(user: UserInfer) {
      // 인자로 받는 user가 User 타입과 매칭되는지 확인하는 isUser 함수
      assert(user, User);
      console.log("적절한 유저입니다.");
}

const user_A = {
      id: 4,
      email: "test@gmail.com",
      name: "woowa",
};

isUser(user_A);

// https://docs.superstructjs.org/guides/01-getting-started
// const user_B = {
//       id: 5,
//       email: "test@gmail.com",
//       name: 4,
// };

// isUser(user_B);
