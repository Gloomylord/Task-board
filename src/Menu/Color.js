import React, {useState} from 'react';
import '../App.css';
import styled from 'styled-components';

let Color =styled.div`
  border-radius: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #4b4b4b;
  border-right: 1px solid #949494;
  cursor: pointer;
  transition: 200ms;
  :hover {
    transform: scale(1.3);
  }
  ${props => `background-color: ${props.color}`}
`;

export default function App({color,changeColor}) {
    const [value] = useState(color);
    function onClick() {
        changeColor(value);
    }

    return <Color onClick={onClick} color={value}/>

}





