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

```ts
function ReadOnlyRepository<T>(target: ObjectType<T> | EntitySchema<T> | string): Repository<T> {}
```

### 2: 호출 시그니처의 제네릭 

- = 타입 시그니처, 타입스크립트의 함수 타입 문법으로 함수의 매개변수와 반환 타입을 미리 선언하는 것

- 함수 호출 시 필요한 타입을 별도로 지정할 수 있게 됨 

- 호출 시그니처를 사용할 때, 제네릭 타입을 어디에 위치시키는지에 따라 타입의 범위와 제네릭 타입을 언제 구체 타입으로 한정할지를 결정

### 3: 제네릭 클래스 

- 외부에서 입력된 타입을 클래스 내부에 적용할 수 있는 클래스

- 제네릭 클래스를 사용하면, 클래스 전체에 걸쳐 타입 매개변수가 적용됨 

  - 특정 메서드를 대상으로 제네릭을 적용하려면, 해당 메서드를 제네릭 메서드로 선언하면 됨 

### 4: 제한된 제네릭 

- TS에서의 제한된 제네릭 = 타입 매개변수에 대한 제약 조건을 설정하는 기능을 의미 

```ts
type ErrorRecord<Key extends string> = Exclude<Key, ErrorCodeType> extends never ? Partial<Record<Key, boolean>> : never;

```

- 타입 매개변수가 특정 타입으로 묶였을 때 키를 바운드 타입 매개변수라고 부름 

  - string을 키의 상한한계라고 함 

- 상속받을 수 있는 타입으론, 기본 타입뿐만 아니라 상황에 따라 인터페이스나 클래스도 사용 가능 (유니온 타입을 상속해서 선언할 수도 있음)


### 5: 확장된 제네릭 

- 제네릭 타입은 여러 타입을 상속받을 수 있으며, 타입 매개변수를 여러 개 둘 수 있음 

  - `<Key extends string>` : 타입을 이렇게 제약하면 제네릭의 유연성을 잃어버림 

  - 제네릭의 유연성을 잃지 않으면서 타입을 제약해야 할 때는, 타입 매개변수에 유니온 타입을 상속해서 선언

    - `<Key extends string | number>`

- 유니온 타입으로 T가 여러 타입을 받게 할 수는 있지만, 타입 매개변수가 여러 개 일때는 처리할 수 없음 

  - 이럴 때는 매개변수를 하나 더 추가하여 선언


### 6: 제네릭 예시

- 제네릭 장점 : 다양한 타입을 받게 함으로써 코드를 효율적으로 재사용할 수 있는 것 

  - API 응답 값의 타입 지정 시 제네릭이 실제 현업에서 가장 많이 활용됨 

- 필요하지 않은 곳에 제네릭을 사용하면 오히려 독이 되어, 코드를 복잡하게 만듬 

  - 제네릭을 굳이 사용하지 않아도 되는 경우 

  - any 사용하기 

  - 가독성을 고려하지 않은 사용 

    - 복잡한 제네릭은 의미 단위로 분할해서 사용하는 게 좋음 
