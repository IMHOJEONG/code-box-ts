/**
 * 값 = 프로그램이 처리하기 위해 메모리에 저장하는 모든 데이터
 */

// 객체도 값
// JS에서는 함수도 값 - 런타임에 함수는 객체로 변환되기 때문

/**
 * TS에선 값과 타입이 함께 사용됨
 * 값과 타입 - TS에서 별도의 네임스페이스에 존재함
 * - 값과 타입을 구분해서 작성할 것
 */

/**
 * 값과 타입 공간에 동시에 존재하는 심볼이 있음
 * - class, enum이 대표적
 */
class Developer {
      name: string;
      domain: string;

      constructor(name: string, domain: string) {
            this.name = name;
            this.domain = domain;
      }
}

// me: Developer -> 타입 / new Developer -> 클래스의 생성자 함수인 값으로 동작
// TS에서 클래스는 타입 애너테이션으로 사용할 수 있지만,
// 런타임에서 객체로 변환되어 JS의 값으로 사용되는 특징을 가지고 있음
// enum 역시 런타임에 객체로 변환되는 값
// enum은 런타임에 실제 객체로 존재하며, 함수로 표현할 수도 있음
const me: Developer = new Developer("zig", "frontend");

enum Direction {
      Up, // 0
      Down, // 1
      Left, // 2
      Right, // 3
}

/**
 * enum도 클래스처럼 타입 공간에서 타입을 제한하는 역할을 하지만, JS 런타임에서 실제 값으로도 사용될 수 있음
 */
enum WeekDays {
      MON = "Mon",
      TUES = "Tues",
      WEDNES = "Wednes",
      THURS = "Thurs",
      FRI = "Fri",
}

type WeekDaysKey = keyof typeof WeekDays;
function printDay(key: WeekDaysKey, message: string) {
      const day = WeekDays[key];
      if (day <= WeekDays.WEDNES) {
            console.log("TEST", day, message);
      }
}

printDay("TUES", "wanna go home");

// enum이 값 공간에서 사용된 경우
enum MyColors {
      BLUE = "#0000FF",
      YELLOW = "#FFFF00",
      MINT = "#2AC1BC",
}

function whatMintColor(palette: { MINT: string }) {
      return palette.MINT;
}

whatMintColor(MyColors);
