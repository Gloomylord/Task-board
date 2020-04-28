import React, {useState} from 'react';
import './App.css';
import Column from "./Column/Column";
import styled from 'styled-components';
import './iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.css';
import './iconmonstr-iconic-font-1.3.0/css/iconmonstr-iconic-font.min.css';
import index from "styled-components/dist/styled-components-macro.esm";

let Container = styled.div`
    display: flex;
    flex-direction: column;
`;

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
    bottom: 50px;
    left: 100px;
    opacity: 0.9;
    transition-duration: 200ms;

`;

let arrColumns = [
    'Планируется',
    'В процессе',
    'Завершено',
];

let arrTasks = [
    {id: 1, task: 'учить JS', column: 'В процессе'},
    {id: 1, task: 'заняться спортом', column: 'Планируется'},
    {id: 2, task: 'изучить styled-components', column: 'В процессе'},
    {id: 3, task: 'овладеть React Hooks', column: 'В процессе'},
    {id: 2, task: "сделять Drag'n'Drop", column: 'Планируется'},
    {id: 1, task: "покушать", column: 'Завершено'},
];

function App() {
    const [column, setColumn] = useState(arrColumns);
    const [tasks, setTasks] = useState(arrTasks);
    const [editTitle, setEditTitle] = useState(null);


    function changeColumn(task, column, id) {
        let taskColumn, taskId;
        tasks.forEach((value) => {
            if (value.task == task) {
                taskColumn = value.column;
                taskId = value.id;
            }
        });
        console.log('task, column', task, column, id);
        if (!id) {
            let id;
            if (taskColumn === column) {
                id = tasks.filter((value => (value.column === column))).length;
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.id > taskId && value.id <= id) {
                            return {id: +value.id - 1, task: value.task, column: value.column};
                        }
                        if (value.task === task) {
                            return {id: id, task, column};
                        }
                        return value;
                    }

                    return value;
                }));
            } else {
                id = tasks.filter((value => (value.column === column))).length + 1;
                setTasks(tasks.map((value) => {
                    if (taskColumn === value.column) {
                        if (value.id > taskId ) {
                            return {id: +value.id - 1, task: value.task, column: value.column};
                        }
                    }
                    if (value.task === task) {
                        return {id: id, task, column};
                    }
                    return value;
                }));
            }


        } else {
            console.log('здесь');
            if (taskColumn !== column) {
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.id > id) {
                            return {id: +value.id + 1, task: value.task, column: value.column};
                        }
                    }
                    if (value.column === taskColumn) {
                        if (value.id > taskId) {
                            return {id: +value.id - 1, task: value.task, column: value.column};
                        }
                    }
                    if (value.task === task) {
                        return {id: +id + 1, task, column};
                    }
                    return value;
                }));
            } else {
                id = +id + 1;
                console.log(+ id + 1,taskId);
                setTasks(tasks.map((value) => {
                    if (value.column === column) {
                        if (value.task === task) {
                            return {id: id , task, column};
                        }
                        if (value.id >= id && value.id < taskId) {
                            return {id: +value.id + 1, task: value.task, column: value.column};
                        }
                        if (value.id <= id  && value.id >= taskId){
                            return {id: +value.id - 1, task: value.task, column: value.column};
                        }

                    }

                    return value;
                }));
            }
        }

        //
        // a.forEach(({id, task, column}) => {
        //     console.log(id, task, column);
        // });

        // let newTasks = [...tasks];
        // let index = newTasks.findIndex((value) => value.task === task);
        // if (index !== -1) {
        //     newTasks[index].column = column;
        //     setTasks(newTasks);
        // }
    }

    function deleteTask(task) {
        setTasks(tasks.filter((value) =>
            value.task !== task)
        )
    }

    function changeTask(lastTask, newTask, title, id) {
        if (!id) {
            setTasks(tasks.map((value) => {
                    return (value.task !== lastTask) ? value :
                        {
                            id: value.id,
                            task: newTask,
                            column: title,
                        }
                })
            );
        }
    }


    function addTask(task, title) {
        let id = tasks.filter((value) => (value.column === title)).sort(sortId).length + 1;
        setTasks(tasks.concat([{
            id: id,
            task: task,
            column: title,
        }]));
    }


    function addColumn(title) {
        setColumn(column.concat([title]));
    }

    function deteteColumn(title) {
        setColumn(column.filter((value) => value !== title));
        setTasks(tasks.filter((value)=> value.column!==title))
    }

    function changeTitlePlace(title,replaceTitle,isBefore) {
        let lastId,id;
        let arr = [...column];
        if(title === replaceTitle) return;

        arr.forEach((value,index) => {
            if(value === title) lastId = index;
        });

        arr.forEach((value,index) => {
            if(value === replaceTitle) id = index;
        });

        if(!isBefore) id += 1;

        if(id > lastId) {
            let value = arr.splice(lastId, 1);
            arr.splice(id - 1, 0, title);
            console.log(id, lastId, arr, value[0],title);
        } else {
            let value = arr.splice(lastId, 1);
            arr.splice(id, 0, title);
            console.log(id, lastId, arr, value[0],title);
        }
        setColumn(arr);
    }

    function sortId(a, b) {
        a = a.id;
        b = b.id;
        if (a > b) return 1;
        if (b > a) return -1;
        if (a == b) return 0;
    }

    function changeStr(str) {
        let newStr = '';
        let letter = str[0];
        let count = 1;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === str[i + 1]) {
                count += 1;
            } else {
                if (count > 1) {
                    newStr += letter + count;
                } else {
                    newStr += letter;
                }
                letter = str[i + 1];
                count = 1;
            }
        }

        return newStr;
    }

    //console.log(changeStr('AAAAABBBBBCCCGAAEEQAAAAA'), 'A5B5C3GA2E2QA5', 'A5B5C3GA2E2QA5' == changeStr('AAAAABBBBBCCCGAAEEQAAAAA'));
    console.log('-------------------------');
    console.log(editTitle);

    return (<>
            <div className="App">
                {column.map((title,index) => {
                    let a = tasks.filter((value) => (value.column === title));
                    a.sort(sortId);
                    return < Column key={title}
                                    title={title}
                                    tasks={a}
                                    deleteTask={deleteTask}
                                    changeColumn={changeColumn}
                                    changeTask={changeTask}
                                    addTask={addTask}
                                    setEditTitle={setEditTitle}
                                    editTitle={editTitle}
                                    deleteColumn={deteteColumn}
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


