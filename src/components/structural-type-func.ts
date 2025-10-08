// 1.
interface Developer {
      faceValue: number;
}

interface BankNote {
      faceValue: number;
}

let developer: Developer = {
      faceValue: 52,
};

let bankNote: BankNote = {
      faceValue: 10000,
};

developer = bankNote;
bankNote = developer;

// 2. 구조적 서브타이핑
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type stringOrNumber = string | number;

// 객체가 가지고 있는 속성(프로퍼티)을 바탕으로 타입을 구분하는 것
// 이름이 다른 객체라도, 가진 속성이 동일하다면, 타입스크립트는 서로 호환이 가능한 동일한 타입으로 여김
interface Pet {
      name: string;
}

interface Cat {
      name: string;
      age: number;
}

let pet: Pet;
export const cat: Cat = {
      name: "Zag",
      age: 2,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
pet = cat;

// 구조적 서브타이핑은 함수의 매개변수에도 적용됨
export function greet(pet: Pet) {
      console.log("Hello, " + pet.name);
}

export const show = () => {
      greet(cat);
};
