export default function (task, changeColumn, deleteTask,isEdit) {
    let Task = document.getElementById(task);
    let width = Task.getBoundingClientRect().width;
    if(!isEdit) {
        Task.onmousedown = function onmousedown(event) {
            if (event.target.className.indexOf('im') >= 0) return;
            let style = Task.style;
            Task.style.cursor = 'grabbing';
            Task.style.width = width + 'px';

            let shiftX = event.clientX - Task.getBoundingClientRect().left;
            shiftX -= Task.style.marginLeft.slice(-Task.style.marginLeft.length + 1, -2);
            let shiftY = event.clientY - Task.getBoundingClientRect().top;
            shiftY -= Task.style.marginTop.slice(-Task.style.marginTop.length + 1, -2);

            let div = document.createElement('div');
            div.id = 'insertionPoint';
            div.className = Task.className.replace('task', '');
            div.style.height = Task.getBoundingClientRect().height + 'px';
            div.style.background = '#fafafa';
            Task.before(div);
            Task.style.position = 'absolute';
            Task.style.margin = 0;
            Task.style.zIndex = 1000;


            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                Task.style.left = pageX - shiftX + 'px';
                Task.style.top = pageY - shiftY + 'px';
            }

            let currentDroppable = null;
            let Container = null;
            let moved = true;
            let id = null;
            let arrPos = null;

            function onMouseMove(event) {
                if (moved) {
                    //Task.style.border = `0.5px solid black`;
                    Task.style.opacity = '80%';
                    Task.style.backgroundColor = '#e1e1e1';
                    Task.style.borderRadius = '6px';
                    Task.style.transformOrigin = `${shiftX}px ${shiftY}px`;
                    Task.style.transform = 'rotate(3deg)';
                    moved = false;
                }
                moveAt(event.pageX, event.pageY);

                Task.style.visibility = 'hidden';
                let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                Task.style.visibility = 'visible';

                if (!elemBelow) {
                    div.remove();
                    document.removeEventListener('mousemove', onMouseMove);
                    Task.style = style;
                    return;
                }

                if (elemBelow.id === 'delete') {
                    Task.style.opacity = 0.3;
                } else {
                    Task.style.opacity = 0.8;
                }

                let droppableBelow = (!elemBelow.closest('#delete')) ? elemBelow.closest('.droppable') :
                    elemBelow.closest('#delete');

                let containerBelow = elemBelow.closest('.container') || Container;


                if (containerBelow !== Container) {

                    if (Container) {
                        div.remove();
                    }

                    Container = containerBelow;

                    if (Container) {
                        Container.querySelector('.edit').before(div);
                    }
                }

                if (droppableBelow && droppableBelow.id === 'delete') {
                    div.remove();
                    Container = null;
                }

                if (currentDroppable !== droppableBelow) {

                    if (currentDroppable) {
                        leaveDroppable(currentDroppable);
                        arrPos = null;
                        id = null;
                    }

                    currentDroppable = droppableBelow;

                    if (currentDroppable) {
                        enterDroppable(currentDroppable);
                    }
                }

                if (currentDroppable && currentDroppable.className.indexOf('droppable') >= 0) {
                    if (!arrPos) {
                        arrPos = [];
                        let elemselfH;
                        let elements = Array.from(currentDroppable.querySelectorAll('.task'));
                        for (let element of elements) {
                            if (element.id !== task) {
                                if (!elemselfH) {
                                    let pos = element.getBoundingClientRect().top +
                                        element.getBoundingClientRect().height / 2;
                                    arrPos.push({
                                        element: element,
                                        pos: pos,
                                    })
                                } else {
                                    let pos = element.getBoundingClientRect().top +
                                        element.getBoundingClientRect().height / 2 - elemselfH;
                                    arrPos.push({
                                        element: element,
                                        pos: pos,
                                    })
                                }
                            } else {
                                //elemselfH = element.getBoundingClientRect().height;
                            }
                        }
                    }

                    let index;
                    for (let i in arrPos) {
                        if (arrPos[i].pos > event.pageY) {
                            index = i;
                            break;
                        }
                    }

                    if (index) {
                        if (id !== index || id == null) {
                            div.remove();
                            id = index;
                            arrPos[index].element.before(div);

                        }
                    } else {

                        currentDroppable.querySelector('.edit').before(div);
                        id = null;
                    }

                } else {
                    id = null;
                    arrPos = null;
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            Task.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                Task.onmouseup = null;
                Task.style = style;
                div.remove();

                if (currentDroppable) {
                    leaveDroppable(currentDroppable);
                }
                if (currentDroppable && currentDroppable.id === 'delete') {
                    deleteTask(Task.id);
                    return;
                } else if (currentDroppable) {
                    changeColumn(Task.id, currentDroppable.id, id);
                    id = null;
                    arrPos = null;
                    return;
                } else if (Container) {
                    changeColumn(Task.id, Container.id.slice(1));

                }
                id = null;
                arrPos = null;
            };

        };

        function enterDroppable(elem) {
            if (elem.id === 'delete') {
                elem.style.backgroundImage = 'url(82-512.webp), linear-gradient(45deg, #f8a261, #6e9fc9)';
                elem.style.transform = 'scale(1.1)';
            } else {
                elem.style.backgroundColor = '#cbcdcf';

            }

        }

        function leaveDroppable(elem) {
            if (elem.id === 'delete') {
                elem.style.background = '';
                elem.style.border = ``;
                elem.style.transform = '';
            } else {
                elem.style.background = '';
            }
        }

        Task.ondragstart = function () {
            return false;
        };
    }
}