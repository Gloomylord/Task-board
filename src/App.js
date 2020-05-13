import React, {useState} from 'react';
import './App.css';
import Column from "./Column/Column";
import styled from 'styled-components';
import './iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.css';
import './iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.min.css';
import {nanoid} from 'nanoid';


let Delete = styled.div`
    background-image: url(/82-512.webp);
    background-blend-mode: overlay;
    -moz-background-size: 100%; 
    -webkit-background-size: 100%; 
    -o-background-size: 100%; 
    background-size: 100%; 
    background-blend-mode: overlay;
    width: 100px;
    height: 100px;
    clip-path: circle(50%);
    position: fixed;
    bottom: 25px;
    left: 100px;
    opacity: 0.9;
    transition-duration: 200ms;
    @media (max-height: 500px){
      bottom: -125px;
      transition: 500ms
      ;
    }

`;

let arrColumns = [
    'Планируется',
    'В процессе',
    'Завершено',
];

let arrTasks = [
    {index: 1, task: 'учить JS', column: 'В процессе'},
    {index: 2, task: 'учить JS', column: 'Планируется'},
    {index: 3, task: 'учить JS', column: 'Планируется'},
    {index: 4, task: 'учить JS', column: 'Планируется'},
    {index: 5, task:  ' учить JS учить JSучить JSучитьJSучитьJSучитьJSучитьJSучитьJSучитьJS', column: 'Планируется'},
    {index: 6, task: 'учить JS', column: 'Планируется'},
    {index: 7, task: 'учить JS', column: 'Планируется'},

    {index: 1, task: 'заняться спортом', column: 'Планируется'},
    {index: 2, task: 'изучить styled-components', column: 'В процессе'},
    {index: 3, task: 'овладеть React Hooks', column: 'В процессе'},
    {index: 2, task: "сделять Drag'n'Drop", column: 'Завершено'},
    {index: 1, task: "покушать", column: 'Завершено'},
];

function addId(arr) {
    arr.map(value => {
            value.id = nanoid();
            return value;
        }
    );
    console.log('arr', arr);
    return arr;
}

function App() {
    const [column, setColumn] = useState(makeColumnArr(arrTasks));
    const [tasks, setTasks] = useState(addId(arrTasks));
    const [editTitle, setEditTitle] = useState(null);


    function makeColumnArr(arr) {
        return Array.from(new Set(arr.map(value => value.column)))
    }

    function changeColumn(id, column, index) {
        let taskColumn, taskIndex;
        tasks.forEach((value) => {
            if (value.id === id) {
                taskColumn = value.column;
                taskIndex = value.index;
            }
        });
        console.log('task, column', id, column, index);
        if (!index) {
            let index;
            if (taskColumn === column) {
                index = tasks.filter((value => (value.column === column))).length;
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.index > taskIndex && value.index <= index) {
                            return {index: +value.index - 1, id: value.id, task: value.task, column: value.column};
                        }
                        if (value.id === id) {
                            return {index: index, task: value.task, column, id};
                        }
                        return value;
                    }

                    return value;
                }));
            } else {
                index = tasks.filter((value => (value.column === column))).length + 1;
                setTasks(tasks.map((value) => {
                    if (taskColumn === value.column) {
                        if (value.index > taskIndex) {
                            return {index: +value.index - 1, id: value.id, task: value.task, column: value.column};
                        }
                    }
                    if (value.id === id) {
                        return {index: index, task: value.task, id, column};
                    }
                    return value;
                }));
            }


        } else {
            console.log('здесь');
            if (taskColumn !== column) {
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.index > index) {
                            return {index: +value.index + 1, id: value.id, task: value.task, column: value.column};
                        }
                    }
                    if (value.column === taskColumn) {
                        if (value.index > taskIndex) {
                            return {index: +value.index - 1, id: value.id, task: value.task, column: value.column};
                        }
                    }
                    if (value.id === id) {
                        return {index: +index + 1, id, task: value.task, column};
                    }
                    return value;
                }));
            } else {
                index = +index + 1;
                console.log(+index + 1, taskIndex);
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.id === id) {
                            return {index: index, task: value.task, column, id};
                        }
                        if (value.index >= index && value.index < taskIndex) {
                            return {index: +value.index + 1, id: value.id, task: value.task, column: value.column};
                        }
                        if (value.index <= index && value.index >= taskIndex) {
                            return {index: +value.index - 1, id: value.id, task: value.task, column: value.column};
                        }

                    }

                    return value;
                }));
            }
        }

        //
        // a.forEach(({index, task, column}) => {
        //     console.log(index, task, column);
        // });

        // let newTasks = [...tasks];
        // let index = newTasks.findIndex((value) => value.task === task);
        // if (index !== -1) {
        //     newTasks[index].column = column;
        //     setTasks(newTasks);
        // }
    }

    function deleteTask(id) {
        setTasks(tasks.filter((value) =>
            value.id !== id)
        )
    }

    function changeTask(newTask, id) {
        setTasks(tasks.map((value) => {
                return (value.id !== id) ? value :
                    {
                        index: value.index,
                        id: value.id,
                        task: newTask,
                        column: value.column,
                    }
            })
        );
    }


    function addTask(task, title) {
        let index = tasks.filter((value) => (value.column === title)).length + 1;
        setTasks(tasks.concat([{
            index: index,
            task: task,
            column: title,
        }]));
    }


    function addColumn(title) {
        setColumn(column.concat([title]));
    }

    function deleteColumn(title) {
        setColumn(column.filter((value) => value !== title));
        setTasks(tasks.filter((value) => value.column !== title))
    }

    function changeTitlePlace(title, replaceTitle, isBefore) {
        let lastId, index;
        let arr = [...column];
        if (title === replaceTitle) return;

        arr.forEach((value, index) => {
            if (value === title) lastId = index;
        });

        arr.forEach((value, i) => {
            if (value === replaceTitle) index = i;
        });

        if (!isBefore) index += 1;

        if (index > lastId) {
            let value = arr.splice(lastId, 1);
            arr.splice(index - 1, 0, title);
            console.log(index, lastId, arr, value[0], title);
        } else {
            let value = arr.splice(lastId, 1);
            arr.splice(index, 0, title);
            console.log(index, lastId, arr, value[0], title);
        }
        setColumn(arr);
    }

    function sortId(a, b) {
        a = a.index;
        b = b.index;
        if (a > b) return 1;
        if (b > a) return -1;
        if (a === b) return 0;
    }


    console.log('-------------------------');
    console.log(editTitle);

    return (<>
            <div className="App">
                {column.map((title, index) => {
                    let a = tasks.filter((value) => (value.column === title));
                    a.sort(sortId);
                    console.log(a);
                    return < Column key={title + index}
                                    title={title}
                                    tasks={a}
                                    deleteTask={deleteTask}
                                    changeColumn={changeColumn}
                                    changeTask={changeTask}
                                    addTask={addTask}
                                    setEditTitle={setEditTitle}
                                    editTitle={editTitle}
                                    deleteColumn={deleteColumn}
                                    changeTitlePlace={changeTitlePlace}
                    />
                })}
                < Column key={'Новый блок'}
                         title={'Новый блок'}
                         tasks={[]}
                         addColumn={addColumn}
                         setEditTitle={setEditTitle}
                         editTitle={editTitle}
                />
            </div>
            <Delete id='delete'/>
        </>

    );
}


export default App;


