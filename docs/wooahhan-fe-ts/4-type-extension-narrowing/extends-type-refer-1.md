좋은 질문이에요. 핵심을 찌르는 내용입니다.

---

## 🔍 요점:

**`interface Foo extends Bar`** 와 **`type Foo = Bar & Baz`** 는 비슷하게 보이지만,
**100% 상응(identical)** 하지는 않습니다.

**✅ 맞습니다. `extends`를 사용한 `interface`는 교차 타입(`&`)과 100% 상응하지 않습니다.**

---

## 🧠 이유 요약:

| 측면           | `interface extends`     | `type A & B` (교차 타입)     |
| ------------ | ----------------------- | ------------------------ |
| **기본 목적**    | 구조 확장 (OOP적)            | 타입 조합                    |
| **충돌 처리**    | 덮어쓰기 **불가** — **오류 발생** | 충돌 시 **never** 혹은 **병합** |
| **선언 병합**    | **가능**                  | 불가능                      |
| **정의 중복 허용** | 불가능 (같은 속성 다른 타입은 오류)   | 가능하지만 타입 충돌 가능성 있음       |

---

## 🔥 예제로 보기

### 1. `interface` vs `type` — 충돌 사례

```ts
interface A {
  x: string;
}

interface B {
  x: number;
}

// ❌ Error: Interface 'C' incorrectly extends interface 'A'.
interface C extends A, B {} // 오류
```

```ts
type A = {
  x: string;
};

type B = {
  x: number;
};

type C = A & B; // ✅ 타입은 생성되지만, x는 never

const test: C = {
  x: 42 // ❌ x의 타입이 never이기 때문에 오류
};
```

### 설명:

* `interface`는 **속성 이름이 같고 타입이 다르면 오류를 냅니다.**
* `type`은 교차 타입 시 충돌하는 속성은 **`never`** 로 추론됩니다.

---

### 2. 선언 병합 (`interface`만 가능)

```ts
interface D {
  x: string;
}

interface D {
  y: number;
}

// 병합되어 { x: string; y: number }
const obj: D = { x: 'hello', y: 123 };
```

```ts
type E = {
  x: string;
};

// ❌ Error: Duplicate identifier 'E'
type E = {
  y: number;
};
```

---

## 🎯 결론

* `interface extends A` 와 `type = A & B` 는 **비슷한 역할을 하더라도**
  → **100% 동일하지 않습니다**. ✅ 당신의 말이 맞습니다.

---

## 🤔 언제 뭐 쓰면 좋을까?

| 상황                            | 추천                 |
| ----------------------------- | ------------------ |
| 클래스와 함께 쓸 때                   | `interface`        |
| 단순 타입 조합, 유니언, 튜플 등 복잡한 타입 구성 | `type`             |
| 선언 병합을 활용하고 싶을 때              | `interface`        |
| 속성 이름 충돌 가능성이 있는 경우           | `type` (명시적 제어 가능) |

---

필요하다면, 특정 사용 시나리오에 따라 어떤 걸 선택하는 게 더 나은지도 도와드릴게요.
