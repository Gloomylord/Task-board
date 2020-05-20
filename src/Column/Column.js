import React, {useState, useEffect, useRef} from 'react';

import styled from 'styled-components';
import Task from "../Task/Task";

import '../iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.css';
import '../iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.min.css';
import MoveColumn from "./MoveColumn";

const Column = styled.div`
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: calc(98vh - 55px);
      align-items: center;
      align-self: flex-start;
      justify-content: center;
      background-color: #e1e3e5;
      transition: background-color 200ms;
      width: 350px;
      padding-top: 0;
      border-radius: 6px;
      margin: 10px;
      ${(props) => !props.addTask && `background-color: rgba(255,255,255,0.4);` +
      `:hover{
          background-color: rgba(255,255,255,0.5);
       }
       :active{
          background-color: rgba(255,255,255,0.6);
       }
      `

}
`;

const Title = styled.div`
      box-sizing: border-box;
      flex-direction: row;
      width: 330px;
      justify-content: space-between;
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      color: #555555;
      padding: 15px;
      cursor: pointer;
      :hover {
          .im{
            opacity: 0.4;
          }
      }
      .im {
         padding: 5px;
         opacity: 0;  
         font-size:15px;
         :hover {
            opacity: 0.8;
         } 
         :active {
            opacity: 1;
         }
      }
      ${props => !props.addTask &&`
        :hover {
            color: #333333;
            .im{
                opacity: 1;
            }            
         }
        .im {
            color: #333333;
            opacity: 1;
            :hover {
                opacity: 1;
            }
            :active {
                opacity: 1;
            }
        }
`}
`;
const AddTask = styled.div`
      box-sizing: border-box;
      flex-direction: row;
      justify-content: space-between;
      display: flex;
      width: 330px;
      align-items: center;
      text-align: center;
      font-size: 14px;
      color: #555555;
      padding: 15px;
      > .im {
        padding: 5px;
        font-size: 14px;
        cursor: pointer;
        :hover{
          color: #878787;
        }
        :active{
          color: #a6a6a6;
        }
      }
      .im-save {
        font-size: 20px !important;
      }
`;
const Textarea = styled.textarea`
        box-sizing: border-box;
        border: #282c34 1px solid;
        border-radius: 4px;
        max-width: 230px;
        min-height: 50px;
        min-width: 230px;
        max-height: 400px ;
        padding: 10px;
        resize: none;
`;

const Container = styled.div`
        padding-top: 30px;
        display: flex;
        flex-direction: column;
`;

const TasksContainer = styled.div`
      display: flex;
      flex-direction: column;
      max-height: calc(100% - 110px);
      align-items: center;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 2px 0;
      > :first-child{
        margin-top: 0;
      }
`;


export default function ContainerColumn(props) {
    let {
        setEditTitle, editTitle, addColumn, addTask, deleteColumn,
        changeTask, changeColumn, title, tasks, deleteTask, changeTitlePlace
    } = props;
    let bc = '#c84b3a';
    let [isEdit, setIsEdit] = useState(false);
    let [value, setValue] = useState('');
    const textarea = useRef(null);

    useEffect(() => {
        if (textarea.current) {
            textarea.current.focus();
        }
        if (title !== 'Новый блок') {
            MoveColumn('m' + title, changeTitlePlace, deleteColumn);
        }
    });

    function changeValue(event) {
        setValue(event.target.value);
    }


    function save() {
        if (value) {
            addTask(value, title, tasks.length);
            setIsEdit(!isEdit);
            setValue('');
        } else {
            textarea.current.placeholder = 'пусто';
        }

    }

    function saveTitle() {
        if (value) {
            addColumn(value);
            setIsEdit(!isEdit);
            setValue('');
        } else {
            textarea.current.placeholder = 'пусто';
        }

    }


    return (
        <Container id={'t' + title} className={addTask && 'container'}>
            <Column id={title} className={addTask && 'droppable'} addTask={addTask}>
                <Title id={(addTask) ? 'm' + title : ''} addTask={addTask}  onClick={()=>{
                    if(!addTask ) {
                        if(!isEdit) {
                            setIsEdit(true);
                            setEditTitle(title);
                        } else {
                            setIsEdit(false);
                        }
                    }
                }}>
                    <div>{title}</div>
                    {addTask ?
                        <i className='im im-x-mark' title='Удалить блок' onClick={() => deleteColumn(title)}/> :
                        isEdit && title === editTitle ?
                            <i className='im im-minus' onClick={() => setIsEdit(false)}/> :
                            <i className='im im-plus'/>
                    }
                </Title>
                {
                    !addTask && isEdit && title === editTitle &&
                    <AddTask>
                        <Textarea ref={textarea} onChange={changeValue} required placeholder='Название блока'/>
                        <i className='im im-save' onClick={saveTitle}/>
                    </AddTask>
                }
                <TasksContainer className='tasks-container'>
                    {
                        tasks.map((value) => (
                            <Task key={value.id}
                                  task={value.task}
                                  id={value.id}
                                  changeColumn={changeColumn}
                                  bc={bc}
                                  title={title}
                                  deleteTask={deleteTask}
                                  changeTask={changeTask}
                            />))
                    }
                </TasksContainer>

                {addTask &&
                <AddTask className='edit'>
                    {isEdit && title === editTitle ?
                        <>
                            <i className='im im-minus' onClick={() => setIsEdit(false)}/>
                            <Textarea ref={textarea} onChange={changeValue} required placeholder='Задача'/>
                            <i className='im im-save' onClick={save}/>
                        </> :
                        <i className='im im-plus' onClick={() => {
                            setIsEdit(true);
                            setEditTitle(title);
                        }}/>
                    }
                </AddTask>
                }

            </Column>
        </Container>
    );

}