## 7. 제네릭

- 다양한 타입 간에 재사용성을 높이기 위해 사용하는 문법

- 함수, 타입, 클래스 등에서 내부적으로 사용할 타입을 미리 정해두지 않고, 타입 변수를 사용해서 해당 위치를 비워둔 다음

  - 실제로 그 값을 사용할 때 외부에서 타입 변수 자리에 타입을 지정하여 사용하는 방식

```ts
type ExampleArrayType<T> = T[];

const array1: ExampleArrayType<string> = ["dd"];
```

- 제네릭은 any와 달리, 배열의 경우, 배열 생성 시점에 원하는 타입으로 특정 가능

- 제네릭 함수를 호출할 때, 반드시 꺾쇠괄호(<>) 안에 타입을 명시해야 하는 것은 아님

  - 타입을 명시하는 부분을 생략하면 컴파일러가 인수를 보고 타입을 추론해줌

  - 타입 추론이 가능한 경우에는 타입 명시를 생략 가능

```ts
function exampleFunc<T>(arg: T): T[] {
  return new Array(3).fill(arg);
}

exampleFunc("test");
```

- 특정 요소 타입을 알 수 없을 때는 제네릭 타입에 기본값을 추가할 수 있음

```ts
interface SubmitEvent<T = HTMLElement> extends SyntheticEvent<T> {
  submitter: T;
}
```

- 제네릭은 일반화된 데이터 타입을 의미

  - 함수나, 클래스 등의 내부에서 제네릭을 사용할 때 어떤 타입이든 될 수 있다는 개념

  - 특정한 타입에서만 존재하는 멤버를 참조하려고 하면 안됨

- ex: 제네릭 꺾쇠괄호 내부에 'length 속성을 가진 타입만 받는다'라는 제약을 걸어주는 경우

  - 이렇게 length 속성을 사용하는 경우도 존재

```ts
interface TypeWithLength {
  length: number;
}

function exampleFunc2<T extends TypeWithLength>(arg: T): number {
  return arg.length;
}
```

- 제네릭을 사용할 때 주의해야 할 점 = 파일 확장가 tsx일 때 화살표 함수에 제네릭을 사용하면 에러가 발생 

  - tsx = 타입스크립트 + jsx라 제네릭의 꺾쇠괄호와 태그의 꺾쇠괄호를 혼동하여 문제

  - 제네릭 부분에 extends 키워드를 사용하여 컴파일러에게 특정 타입의 하위 타입만 올 수 있음을 확실히 알려주면 됨 

```tsx
// TSX 
// const arrowExampleFunc2 = <T extends {}>(arg: T): T[] => {
// => <T>(arg: T)라면, tsx 파일에서 오류가 남 
const arrowExampleFunc2 = <T extends {}>(arg: T): T[] => {
  return new Array(3).fill(arg)
}
```

--- 

### 1: 함수의 제네릭 

- 어떤 함수의 매개변수나, 반환 값에 다양한 타입을 넣고 싶을 때 제네릭을 사용 가능 

- 

### 2: 호출 시그니처의 제네릭 


### 3: 제네릭 클래스 

### 4: 제한된 제네릭 


### 5: 확장된 제네릭 



### 6: 제네릭 예시