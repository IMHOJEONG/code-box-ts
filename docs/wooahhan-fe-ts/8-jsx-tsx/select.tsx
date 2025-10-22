const Select = ({ onChange, options, selectedOption }) => {
      const handleChange = (e) => {
            const selected = Object.entries(options).find(([_, value]) => value === e.target.value)?.[0];
            onChange?.(selected);
      };

      return (
            <select onChange={handleChange} value={selectedOption && options[selectedOption]}>
                  {Object.entries(options).map(([key, value]) => (
                        <option key={key} value={value}>
                              {value}
                        </option>
                  ))}
            </select>
      );
};

// 추가적인 설명이 없다면, 컴포넌트를 사용하는 입장에서 각 속성에 어떤 타입의 값을 전달해야 할지 알기 어려움 

// - 컴포넌트를 사용하는 개발자가 각 속성에 어떤 타입의 값을 전달해야 할지 명확히 알 수 있도록 추가적인 설명 필요 

