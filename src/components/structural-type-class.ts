class Person {
      name: string;
      age: number;

      constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
      }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Developer {
      name: string;
      age: number;
      sleeptime: number;

      constructor(name: string, age: number, sleeptime: number) {
            this.name = name;
            this.age = age;
            this.sleeptime = sleeptime;
      }
}

function greet(p: Person) {
      console.log(`Hello, I'm ${p.name}, ${p.age}`);
}

export const show = () => {
      // Developer는 Person이 갖고 있는 속성을 가지고 있음
      const developer = new Developer("tester", 30, 3600);
      greet(developer);
};

// ---

interface Cube {
      width: number;
      height: number;
      depth: number;
}

// TS는 c[axis]가 어떤 속성을 지닐지 알 수 없으며,
// c[axis] 타입을 number로 확정할 수 없어서 에러를 발생시킴
function addLines(c: Cube) {
      let total = 0;

      for (const axis of Object.keys(c)) {
            //   Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Cube'.
            //   No index signature with a parameter of type 'string' was found on type 'Cube'.ts(7053)
            const length = c[axis];

            total = length;
      }
}

// TS에 명목적 타이핑 언어의 특징을 가미한 식별한 수 있는 유니온 같은 방법이 생김
