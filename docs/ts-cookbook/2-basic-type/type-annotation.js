"use strict";
// 추론됨
// 반환 형식은 { name: string, age: number }
function createPerson() {
      return {
            name: "Stefan",
            age: 30,
      };
}
// 추론됨
// me: { name: string, age: number }
const me = createPerson();
// 함수의 시그니처 매개변수에 형식 애너테이션을 추가하면, 컴파일러가 함수를 호출할 때 인수의 형식을 검사
function printPerson(person) {
      console.log(person.name, person.age);
}
printPerson(me);
