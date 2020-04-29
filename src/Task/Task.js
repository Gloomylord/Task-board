import React, {useState, useEffect, useRef} from 'react';

import styled from 'styled-components';
import moveTask from "./MoveTask";

let mar = 10;

const Background = styled.div`
      
      max-width: 100vw !important;
      width: 100vw;
      height: 100vh;
      background-color: #282c34;
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.3 
`;

const BackgroundBlock = styled.div`
      max-width: 100vw !important;
      background-color: rgba(40,44,52,0);
      border-radius: 10px;
      border: 0;
      margin: ${mar}px;
`;

const Button = styled.button`
      box-sizing: border-box;
      background-color: rgb(96,204,52);
      color: white;
      border-radius: 5px;
      font-size: 16px;
      border: 0;
      margin-bottom: 10px;
      height: 32px;
      width: 118px;
      align-self: flex-start;
      cursor: pointer;
      :hover{
        background-color: rgb(0,187,0);
      }
      :active{
        background-color: rgb(0,153,0);
      }
`;



const Task = styled.div`
      box-sizing: border-box;
      display: flex;
      align-items: center;
      margin: ${mar}px;
      flex-direction: row;
      justify-content: space-between;
      font-size: 14px;
      color: #6d6d6d;
      width: 95%;
      padding: 8px 12px 4px;
      cursor: pointer;
      border-radius: 3px;
      transition: transform 200ms, opacity 200ms, color 200ms, height 1000ms;
      background: white;
      :hover {
        background: #fcfcfc;
      }
      
      div {
         max-width: 250px;
      }
      
      i {
          align-self: center;
          transition-duration: 100ms;
          padding: 5px;
          font-size: 18px;
          opacity: 0;
      }
      
      .im-x-mark-circle-o {
          margin-left: 5px;
      }
      
      :hover {
        i {
          opacity: 0.4;
          :hover{
            opacity: 0.8;
           }
          :active{
            opacity: 1;
          }
        }
      }
      
      .textarea-background{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        z-index: 1000;
      }
      
      textarea {
        box-sizing: border-box;
        border: #282c34 1px solid;
        border-radius: 4px;
        width: 95%;
        max-width: 300px;
        min-width: 300px;
        min-height: 70px;
        max-height: 200px ;
        margin-bottom: 20px;
        padding: 5px;
        resize: none;
      }
      .im-save {
        opacity: 1 !important;
        color: green;
        padding:5px;
        :hover {
          color: #006600 !important;
        }
      }
      ${(props) => props.isEdit &&
    'position: absolute;' +
    'z-index: 1000;' +
    'width: 332px;'+
    'flex-direction: column;'+
    'margin: 0;'
}
`;


export default function ContainerTask(props) {
    let {task, title, changeTask, deleteTask, changeColumn} = props;
    let [isEdit, setIsEdit] = useState(false);
    let [value, setValue] = useState(task);
    let [posY, setPosY] = useState(null);
    let [posX, setPosX] = useState(null);
    let [width, setWidth] = useState(null);
    let [height, setHeight] = useState(null);
    const inputEl = useRef(null);
    const taskRef = useRef(null);
    const mainRef = useRef(null);
    const taskBackground = useRef(null);

    useEffect(() => {
        moveTask(task, changeColumn, deleteTask,isEdit);
        return () => {
            document.getElementById(task).onmousedown = null;
        }
    });

    useEffect(() => {
        if (inputEl.current) {
            inputEl.current.focus();
        }
        if(mainRef.current && posY && posX){
            mainRef.current.style.top = posY + 'px';
            mainRef.current.style.left = posX + 'px';
        }
        if(taskBackground.current && height && width){
            console.log(height, width);
            taskBackground.current.style.width =  width + 'px';
            taskBackground.current.style.height = height + 'px';
        }
    });

    function changeValue(event) {
        setValue(event.target.value);
    }

    function save() {
        if (value ) {
            changeTask(task, value , title);
            setIsEdit(!isEdit);
        } else {
            inputEl.current.placeholder = 'пусто';
        }
    }

    function edit() {
        setWidth(mainRef.current.getBoundingClientRect().width);
        setHeight(mainRef.current.getBoundingClientRect().height);
        setPosX(mainRef.current.getBoundingClientRect().left);
        setPosY((mainRef.current.getBoundingClientRect().top  ));
        setIsEdit(!isEdit);
    }


    return (<>
            {isEdit && <BackgroundBlock ref={taskBackground} />}
            {isEdit && <Background className='full' onClick={() => setIsEdit(!isEdit)}/>}
            <Task className='task' ref={mainRef} id={task} key={task} isEdit={isEdit}>
                {(isEdit) ?
                    <>
                        <textarea  onChange={changeValue} ref={inputEl} defaultValue={task}/>
                        <Button onClick={save}>
                            <div onClick={save}>Сохранить</div>
                        </Button>
                    </> :
                    <>
                        <div>{task}</div>
                        <div>
                            <i className='im im-edit' onClick={edit}/>
                            <i className='im im-x-mark-circle-o'
                               onClick={() => deleteTask(task)}/>
                        </div>
                    </>
                }
            </Task>
        </>
    );
}

