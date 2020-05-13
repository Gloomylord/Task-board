import React, {useEffect, useState} from 'react';
import '../App.css';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import Color from "./Color";

let Menu = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 7fr 1fr;
    width: 200px;
    height: 125px;
    box-sizing: border-box;
    position: fixed;
    bottom: -125px;
    left: 175px;
    opacity: 0.9;
    transition-duration:0.5s;
    background-color: rgba(225,227,229,0.9);
    padding: 10px 20px;
    color: #282c34;
    border: #b0b0b0 solid 1px;
    border-radius: 5px 5px 0 0 ;
    @media (max-height: 500px){
      bottom: -125px;
      transition: 500ms;
    }
    z-index: 2;
    ${props => props.showMenu && `
    bottom: 0px;
    transition-duration:1s;
    `
}
`;

let ButtonHide = styled.div`
  background-color: rgba(225,227,229);
  align-self: center;
  padding: 10px 20px;
  color: #282c34;
  border: #b0b0b0 solid 1px;
  border-radius: 5px;
  transition: 200ms;
  cursor: pointer;
  :hover{
    background-color: rgba(176,178,180);
  }
  :active{
     background-color: rgba(148,150,152);
  }
  .im{
    font-size: 16px;
  }
  display: flex;
  justify-content: center ;
`;

let ButtonShow = styled.div`
  cursor: pointer;
  transition: 500ms ;
  background-color: rgba(225,227,229,0.8);
  align-self: center;
  padding: 10px 20px;
  color: #282c34;
  border: #b0b0b0 solid 1px;
  border-radius: 30px 30px 0 0;
  display: flex;
  justify-content: center;
  z-index: 1;
  flex-direction: column;
  .i{
    align-self: center;
  }
  height: 70px;
  box-sizing: border-box;
  position: fixed; 
  bottom: -100px;
  left: 242px;
  :hover{
    background-color: rgba(176,178,180,0.8);
  }
  :active{
     background-color: rgba(148,150,152,0.8);
  }
  ${props => !props.showMenu && `
    bottom: 0;
    transition-duration:1s;
  `
};
  @media (max-height: 500px){
      bottom: -125px;
      transition: 500ms;
    }
`;

let ColorGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(45px,1fr));
    grid-column-gap: 8px;
    grid-row-gap: 5px ;
    padding-bottom: 5px;
`;

let arrColor = [
    '#e88da3',
    'rgb(36, 147, 8)',
    'rgb(217, 196, 6)',
    '#26a3df',
    '#f38a07',
    '#f31c82',
    'rgb(15, 176, 144)',
    'rgb(133,82,176)',
    'rgb(142,176,35)',
];


export default function App() {
    const [showMenu, setShowMenu] = useState(false);
    const [color, setColor] = useState('#e88da3')
    useEffect(() => {
        document.body.style.backgroundColor = color;
    }, [color]);

    function changeColor(color) {
        setColor(color)
    }

    function changeShowMenu() {
        setShowMenu(!showMenu);
    }


    return (<>
            <Menu id='menu' showMenu={showMenu}>
                <ColorGrid>
                    {arrColor.map(value => <Color key={nanoid()}
                                                  color={value}
                                                  changeColor={changeColor}
                    ></Color>)}
                </ColorGrid>
                <ButtonHide onClick={changeShowMenu}>
                    <div>
                        <i className='im im-arrow-down'/>
                    </div>
                </ButtonHide>
            </Menu>
            <ButtonShow showMenu={showMenu} onClick={changeShowMenu}>
                <i className='im im-arrow-up'/>
            </ButtonShow>
        </>

    );
}





