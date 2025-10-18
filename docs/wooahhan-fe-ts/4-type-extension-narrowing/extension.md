## 4.1 타입 확장하기 

- 타입 확장 = 기존 타입을 사용해서 새로운 타입을 정의하는 것 

- TS에선, interface와 type 키워드를 사용해 타입을 정의 

    - extends, 교차 타입, 유니온 타입을 사용해 타입을 확장함 


### 1: 타입 확장의 장점 

- 코드 중복을 줄일 수 있다는 것 

    - TS 코드를 작성하다 보면 필연적으로 중복되는 타입 선언이 생기기 마련 

        - 중복되는 타입을 반복적으로 선언하는 것보다, 기존에 작성한 타입을 바탕으로 타입 확장을 하는 방식 

            - 불필요한 중복 감소의 장점 
 
```ts

// 인터페이스의 경우 
interface BaseMenuItem {
    itemName: string | null;
    itemImageUrl: string | null;
    //...
}

interface BaseCartItem extends BaseMenuItem {
    quantity: number;
}

// type 키워드의 경우 
type BaseMenuItem = {
    itemName: string | null;
    itemImageUrl: string | null;
    //...
}

type BaseCartItem = {
    quantity: number; 
} & BaseMenuItem
```

- 타입 확장 = 중복 제거, 명시적인 코드 작성 + 확장성이라는 장점 가짐 

- 요구사항이 생길 때마다 필요한 타입을 손쉽게 만들 수 있음 

    - 기존 요구 사항이 변경되어도, 해당 타입만 수정하면 되는 장점이 있음 

### 2: 유니온 타입 

- 2개 이상의 타입을 조합해 사용하는 방법 

- 집합 관점에서의 유니온 타입은 합집합으로 볼 수 있음 

```ts
type MyUnion = A | B
// A와 B의 유니온 타입인 MyUnion은 타입 A와 B의 합집합 
// 합집합으로 해석 
    // A의 모든 원소는 집합 MyUnion의 요소 
    // B의 모든 원소는 집합 MyUnion의 요소 
```

- 주의! 유니온 타입으로 선언된 값은 유니온 타입에 포함된 모든 타입이 공통으로 갖고 있는 속성에만 접근 가능 

```ts
interface CookingStep {
    orderId: string; 
    price: number;
}

interface DeliveryStep {
    orderId: string; 
    time: number;
    distance: string;
}

function getDeliveryDistance(step: CookingStep | DeliveryStep) {
    // ts error 
    return step.distance;
}
```

`타입스크립트의 타입을 속성의 집합이 아니라, 값의 집합이라고 생각해야 유니온 타입이 합집합이라는 개념 이해 가능`

    - `step: CookingStep | DeliveryStep` => step이라는 유니온 타입은 CookintStep 또는 DeliveryStep 타입에 해당할 뿐이지, CookingStep이면서 DeliveryStep인 것은 아님 


### 3: 교차 타입 

- 기존 타입을 합쳐 필요한 모든 기능을 가진 하나의 타입을 만드는 것으로 이해 가능 

- 유니온 타입과의 차이 존재 

```ts
interface CookingStep {
    orderId: string;
    time: number;
    price: number;
}

interface DeliveryStep {
    orderId: string; 
    time: number;
    distance: string;
}

// BaedalProgress = CookingStep과 DeliveryStep 타입을 합쳐 모든 속성을 가진 단일 타입이 됨 
type BaedalProgress = CookingStep & DeliveryStep

// progress값은 CookingStep이 갖고 있는 price 속성과 DeliveryStep이 갖고 있는 distance 속성을 포함함 
function logBaedalInfo(progress: BaedalProgress) {
    console.log(
        progress.price,
        progress.distance   
    )
}
```

#### 교차 타입의 개념?

- 교차 타입 = 교집합의 개념과 비슷 

```ts
type MyIntersection = A & B;
// MyIntersection 타입의 모든 값은 A 타입의 값이며, 
// MyIntersection 타입의 모든 값은 B 타입의 값 
```

`TS의 타입을 속성의 집합이 아니라, 값의 집합으로 이해해야 함`

```ts
interface CookingStep {
    orderId: string;
    time: number;
    price: number;
}

interface DeliveryStep {
    orderId: string; 
    time: number;
    distance: string;
}

// BaedalProgress 교차 타입 = CookingStep이 가진 속성과 DeliveryStep이 가진 속성을 모두 만족하는 값의 타입(집합)이라고 해석할 수 있음
type BaedalProgress = CookingStep & DeliveryStep
```


```ts
interface DeliveryTip {
    tip: string;
}

interface StarRating {
    rate: number;
}

type Filter = DeliveryTip & StarRating

const filter: Filter = {
    tip: '1000원 이하',
    rate: 5
}
```

- 교차 타입 = 두 타입의 교집합을 의미 
    - DeliveryTip과 StarRating은 공통된 속성이 없는데도, Filter의 타입은 공집합(never타입)이 아닌 
    - DeliveryTip과 StarRating의 속성을 모두 포함한 타입이 됨 

        - 타입이 속성이 아닌 값의 집합으로 해석되기 때문

    - 즉, 교차 타입 Filter는 DeliveryTip의 tip 속성과 StarRating의 rate 속성을 모두 만족하는 값이 됨 

- 교차 타입을 사용 시, 타입이 서로 호환되지 않는 경우도 있음 

```ts
type IdType = string | number
type Numeric = number | boolean

type Universal = IdType & Numeric 
// 1. string 이면서 number인 경우 
// 2. string 이면서 boolean인 경우 
// 3. number 이면서 number인 경우  => 이것임 
// 4. number 이면서 boolean인 경우 
```

### 4. extends와 교차 타입 

- extends 키워드를 사용해서 교차 타입을 작성 가능 

```ts
interface BaseMenuItem {
    itemName: string | null
}

interface BaseCartItem extends BaseMenuItem {
    quantity: number;
}
// BaseCartItem은 BaseMenuItem을 확장 -> BaseMenuItem의 속성을 모두 포함 

// --------

type BaseMenuItem = {
    itemName: string | null
}

type BaseCartItem = BaseMenuItem & {
    quantity: number;
}
// BaseCartItem은 BaseMenuItem을 확장 -> BaseMenuItem의 속성을 모두 포함 
```

- 교차 타입을 사용한 코드에선 interface가 아닌, type로 선언함 
    - 유니온 타입과 교차 타입을 사용한 새로운 타입은 오직 type 키워드로만 선언할 수 있음 

- 주의! extends 키워드를 사용한 타입, 교차 타입과 100% 상응하지 않는다

```ts
interface DeliveryTip {
    itemName: string | null
}

interface Filter extends DeliveryTip {
    itemName: number;
}
// Interface 'Filter' incorrectly extends interface 'DeliveryTip'.
//   Types of property 'itemName' are incompatible.
//     Type 'number' is not assignable to type 'string'.(2430)
```

- 호환되지 않는다는 에러 발생, 교차 타입에서는 가능 

```ts
type DeliveryTip = {
    itemName: string 
}

type Filter = DeliveryTip & {
    itemName: number;
}

const test: Filter = {
  itemName: 'a',
}
// Type 'string' is not assignable to type 'never'.(2322)
// input.tsx(2, 5): The expected type comes from property 'itemName' which is declared here on type 'Filter'
```

- itemName의 속성은 이 때, never가 됨 

- type 키워드는 교차 타입으로 선언되었을 때 새롭게 추가되는 속성에 대해 미리 알 수 없기 때문에, 선언 시 에러가 발생하지 않음 

    - 하지만, itemName이라는 같은 속성에 대해 서로 호환되지 않는 타입이 선언되어 결국 never가 된 것 









