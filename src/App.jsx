import { useState } from 'react';
import './App.css';
import CustomSelect from './Components/CustomSelect/CustomSelect';

function App() {
  const [value, setValue] = useState(null);



  // group options

  
  const groupedOptions = [
    {
      label: 'Fast Food',
      options: [
        { label: 'Pizza', value: 'option1' },
        { label: 'Burger', value: 'option2' },
        { label: 'Sandwich', value: 'option3' },
        { label: 'Coffee', value: 'option4' },
        { label: 'Cake', value: 'option5' },
        { label: 'Fries', value: 'option6' },
      ]
    },
    {
      label: 'Main Course',
      options: [
        { label: 'Rice', value: 'option7' },
        { label: 'Bread', value: 'option8' },
        { label: 'Fruit', value: 'option9' },
      ]
    },
    {
      label: 'Drinks',
      options: [
        { label: 'Shake', value: 'option10' },
        { label: 'Juice', value: 'option11' },
        { label: 'Cold Drink', value: 'option12' },
        { label: 'Mojito', value: 'option13' }, 
      ]
    }
  ];

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  const handleMenuOpen = () => {
    console.log('Menu opened');
  };

  const handleSearch = (searchTerm) => {
    console.log('Search:', searchTerm);
  };

  return (
    <div className='kzui-custom-select_main-container'>

      <h2>Custom Select Component</h2>

      <CustomSelect
        isClearable={true}
        isSearchable={true}
        isDisabled={false}
        options={groupedOptions}
        value={value}
        placeholder="Add Preferred Food Items"
        isGrouped={true}
        isMulti={true}
        onChangeHandler={handleChange}
        onMenuOpen={handleMenuOpen}
        onSearchHandler={handleSearch}
      />
      
    </div>
  );
}

export default App;
