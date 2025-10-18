## 5.1 조건부 타입 

- 조건에 따라 다른 타입을 반환해야 할 때가 있음, TS에서는 조건부 타입을 사용해 조건에 따라 출력 타입을 다르게 도출 가능 

- `Condition ? A : B` 형태를 가지고, A = Condition이 true일 때 도출되는 타입이고 B = false일 때 도출되는 타입 

    - 조건부 타입을 활용하면 중복되는 타입 코드를 제거하고 상황에 따라 적절한 타입을 얻을 수 있음 = 더욱 정확한 타입 추론을 할 수 있음 

### 1: extends와 제네릭을 활용한 조건부 타입 

- extends 키워드 = 타입을 확장할 때, 타입을 조건부로 설정할 때, 제네릭 타입에선 한정자 역할로도 사용됨 

- `T extends U ? X : Y` 

    - 조건부 타입에서 extends를 사용할 때는 JS 삼항 연산자와 함께 사용 

    - 타입 T를 U에 할당할 수 있으면 X 타입, 아니면 Y 타입으로 결정됨을 의미 

```ts
interface Bank {
    financialCode: string;
    companyName: string;
    name: string;
    fullName: string;
}

interface Card {
    financialCode: string;
    companyName: string;
    name: string;
    appCardType?: string;
}

type PayMethod<T> = T extends "card" ? Card : Bank;
type CardPayMethodType = PayMethod<"card">
type BankPayMethodType = PayMethod<"bank">
```

### 2: 조건부 타입을 사용하지 않았을 때의 문제점 

- 인자로 넣는 타입에 알맞은 타입을 반환하고 싶지만, 타입 설정이 유니온으로만 되어있기 때문에, TS는 해당 타입에 맞는 타입을 추론할 수 없음

```ts
interface PayMethodBaseFromRes {
    financialCode: string;
    name: string;
}

interface Bank extends PayMethodBaseFromRes {
    fullName: string;
}

interface Card extends PayMethodBaseFromRes {
    appCardType?: string;
}

type PayMethodInfo<T extends Bank | Card> = T & PayMethodInterface;
type PayMethodInterface = {
    // ...
}
```

- useGetRegisteredList 함수는 useQuery의 반환 값을 덜려줌 

```ts
type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>;
export const useGetRegisteredList = (
    type: "card" | "appcard" | "bank"
): UseQueryResult<PayMethodType[]> => {
    const url =  `${type === "appcard" ? "card" : type}`;  // ... ~~

    const fetcher = fetcherFactory<PayMethodType[]>({
        onSuccess: (res) => {
            const usablePocketList = res?.filter(
                (pocket: PocketInfo<Card> | PocketInfo<Bank>) => 
                    pocket?.useType === 'USE'
            ) ?? [];

            return usablePocketList;
        },
    });

    const result = useCommonQuery<PayMethodType[]>(url, undefined, fetcher);

    return result;
}
```


### 3: extends 조건부 타입을 활용하여 계산하기

- useGetRegisteredList 함수의 반환 Data는 인자 타입에 따라 정해짐 

    - type: "card" | "appcard" => PocketInfo<Card>

    - type: "bank" => PocketInfo<Bank>

- API 함수를 각각 분리? => 엔드포인트의 마지막 경로만 다르고, 같은 컴포넌트에서 사용되면 하나의 함수에서 한 번에 관리해야 하는 상황

```ts
type PayMethodType<T extends "card" | "appcard" | "bank"> = T extends 
    | "card"
    | "appcard"
    ? Card : Bank;

export const useGetRegisteredList = <T extends "card" | "appcard" | "bank">(
    type: T
): UseQueryResult<PayMethodType<T>[]> => {
     const url =  `${type === "appcard" ? "card" : type}`;  // ... ~~

    const fetcher = fetcherFactory<PayMethodType<T>[]>({
        onSuccess: (res) => {
            const usablePocketList = res?.filter(
                (pocket: PocketInfo<Card> | PocketInfo<Bank>) => 
                    pocket?.useType === 'USE'
            ) ?? [];

            return usablePocketList;
        },
    });

    const result = useCommonQuery<PayMethodType<T>[]>(url, undefined, fetcher);

    return result;
}

```

- 활용 예시 

    - 제네릭, extends를 함께 사용해 제네릭으로 받는 타입을 제한했음 

        - => 개발자는 잘못된 값을 넘길 수 없기 때문에 휴먼 에러 방지 가능 

    - extends를 활용해 조건부 타입을 설정 

        - 조건부 타입을 사용해서 반환 값을 사용자가 원하는 값으로 구체화할 수 있음 (불필요한 타입 가드, 타입 단언 등을 방지할 수 있음)

### 4: infer를 활용해서 타입 추론하기 

- extends를 사용할 때 infer 키워드를 사용할 수 있음 

- `infer` = 타입 추론 역할 

```ts
// UnpackPromise 타입 - 제네릭으로 T를 받아 T가 Promise로 래핑된 경우라면 K를 반환하고, 그렇지 않은 경우에는 any를 반환
// Promise<infer K> - Promise의 반환 값을 추론해 해당 값의 타입을 K로 한다는 의미
type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;

const promises = [
    Promise.resolve('Mark'),
    Promise.resolve(38)
]

type Expected = UnpackPromise<typeof promises>; // string | number
```

- extends와 infer, 제네릭을 활용하면 타입을 조건에 따라 더 세밀하게 사용할 수 있음 

```ts
// 나머지는 생략 ..

type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> = T extends ReadonlyArray<infer U>
    // U가 MainMenu 타입이라면, subMenus를 infer V로 추출
    ? U extends MainMenu
        // subMenus는 옵셔널한 타입 - 추출한 V가 존재한다면(SubMenu 타입에 할당할 수 있다면)
        // UnpackMenuNames에 다시 전달
        ? U["subMenus"] extends infer V
            // V가 존재하지 않는다면 MainMenu의 name은 권한에 해당 -> U["name"] 
            ? V extends ReadonlyArray<SubMenu>
                ? UnpackMenuNames<V> : U["name"]
            : never
        // U가 MainMenu가 아니라 SubMenu에 할당할 수 있다면(U는 SubMenu 타입이기 때문에), 
        // U["name"]은 권한에 해당 
        : U extends SubMenu
            ? U["name"] : never
    : never;

export type PermissionNames = UnpackMenuNames<typeof menuList>;
```

## 5.2 템플릿 리터럴 타입 활용하기 

- 유니온 타입을 사용해 변수 타입을 특정 문자열로 지정 가능 

```ts
type HeaderTag = "h1" | "h2" | "h3" | "h4" | "h5"
```

- 컴파일타임 변수에 할당되는 타입을 특정 문자열로 정확하게 검사하여 휴먼 에러를 방지할 수 있고, 자동 완성 기능을 통해 개발 생산성을 높일 수 있음 

- TS 4.1부터, 템플릿 리터럴 타입을 지원하기 시작 

- JS의 템플릿 리터럴 문법을 사용해 특정 문자열에 대한 타입을 선언할 수 있는 기능 

```ts
type HeadingNumber = 1 | 2 | 3 | 4 | 5 | 6
type HeaderTag = `h${HeadingNumber}`
```

- 주의! TS 컴파일러가 유니온을 추론하는 데 시간이 오래 걸리면 비효율적이기 때문에, TS가 타입을 추론하지 않고 에러를 뱉어낼 수 있음 

    - 템플릿 리터럴 타입에 삽입된 유니온 조합의 경우의 수가 너무 많지 않게 적절하게 나누어 타입을 정의하는 것이 좋음 

## 5.3 커스텀 유틸리티 타입 활용하기 

- TS에서 제공하는 유틸리티 타입만으로는 표현하는 데 한계를 느끼기도 함 

    - 유틸리티 타입을 활용한 커스텀 유틸리티 타입을 제작해서 사용하자 

### 5.3.1: 유틸리티 함수를 활용해 styled-components의 중복 타입 선언 피하기 

- styled-components로 만든 컴포넌트에 넘겨주는 타입은 props에서 받은 타입과 동일할 때가 대부분 

    - TS에서 제공하는 Pick, Omit 같은 유틸리티 타입을 잘 활용하여 코드를 간결하게 작성 가능 


## 5.4 불변 객체 타입으로 활용하기 

- 상숫값을 관리할 때 객체를 사용

- 컴포넌트나 함수에서 이러한 객체를 사용할 때 열린 타입으로 설정 가능 

```ts
const colors = {
    red: '~~',
    green: '~~',
    blue: '~~'
}

// 키 타입을 해당 객체에 존재하는 키값으로 설정하는 게 아니라, string으로 설정하면, getColorHex 함수의 반환 값은 any가 됨 
const getColorHex = (key: string) => colors[key];
```

- `as const` 키워드로 객체를 불변 객체로 선언 & `keyof` 연산자를 사용하여 getColorHex 함수 인자로 실제 colors 객체에 존재하는 키값만 받도록 설정할 수 있음 

- keyof, as const로 객체 타입을 구체적으로 설정하면 타입에 맞지 않는 값을 전달할 경우, 타입 에러가 반환되기 때문에 컴파일 단계에서 발생할 수 있는 실수를 방지 가능 

    - 또한 자동 완성 기능을 통해 객체에 어떤 값이 있는지 쉽게 파악 가능 


## 5.5 Record 원시 타입 키 개선하기 

- 객체 선언 시 키가 어떤 값인지 명확하지 않다면, Record의 키를 string이나 number 같은 원시 타입으로 명시하기도 함 

    - 문제가 됨, TS는 키가 유효하지 않더라도 타입상으로는 문제가 없기 때문에, 오류를 표시하지 않음 

### 5.5.1 무한한 키를 집합으로 가지는 Record 

```ts
type Category = string;
interface Food {
    name: string;
    // ...
}

// Category의 타입은 string -> Category를 Record의 키로 사용하는 foodByCategory 객체는 무한한 키 집합을 가지게 됨 -> foodByCategory 객체에 없는 키값을 사용하더라도 TS는 오류를 표시하지 않음 

const foodByCategory: Record<Category, Food[]> = {
    한식: [{ name: "~~"}, { name: "!!~"}],
    일식: [{ name: "~~"}, { name: "!!~"}],
}

```

- foodByCategory["양식"]은 런타임에서 undefined가 되어 오류를 반환 

    - JS의 optional chaining으로 런타임 에러 방지 가능 

```ts
foodByCategory["양식"];
foodByCategory["양식"].map((food) => console.log(food.name));

// 1. 옵셔널 체이닝 이용 
foodByCategory["양식"]?.map((food) => console.log(food.name));
```

- But, 어떤 값이 undefined인지 매번 판단해야 하는 번거로움 존재 

    - 실수로 undefined일 수 있는 값을 인지하지 못하고, 코드를 작성하면 예상치 못한 런타임 에러가 발생 가능 

- TS 기능을 활용하여 개발 중 유효하지 않은 키가 사용되었는지 도는 undefined일 수 있는 값이 있는지 등 사전에 파악 가능 

### 5.5.2 유닛 타입으로 변경하기 

- 키가 유한한 집합 -> 유닛 타입 = 다른 타입으로 쪼개지지 않고 오직 하나의 정확한 값을 가지는 타입

```ts
type Category = "한식" | "일식"

interface Food {
    name: string;
    // ...
}

const foodByCategory: Record<Category, Food[]> = {
    한식: [{ name: "~~"}, { name: "!!~"}],
    일식: [{ name: "~~"}, { name: "!!~"}],
}
```

- 개발 중에 유효하지 않은 키가 사용되었는지를 확인할 수 있음 

- 키가 무한해야 하는 상황에서는 적합하지 않음 

### 5.5.3 Partial을 활용하여 정확한 타입 표현 

- 키가 무한한 상황에선 Partial을 사용해 해당 값이 undefined일 수 있는 상태임을 표현 가능 

- 객체 값이 undefined일 수 있는 경우에 Partial을 사용해 PartialRecord 타입을 선언하고 객체를 선언할 때 이것을 활용 가능 

```ts
type PartialRecord<K extends string, T> = Partial<Record<K,T>>;
type Category = string;

interface Food {
    name: string;

}

const foodByCategory: PartialRecord<Category, Food[]> = {
    한식: [{ name: "~~"}, { name: "!!~"}],
    일식: [{ name: "~~"}, { name: "!!~"}],
}

// 경고문을 알려줍니다.
// Object is possibly 'undefined'.
    // 사전에 조치할 수 있게 됨 
foodByCategory["양식"];
foodByCategory["양식"].map((food) => console.log(food.name));
 
foodByCategory["양식"]?.map((food) => console.log(food.name));
```