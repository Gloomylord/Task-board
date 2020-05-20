export default function (id, changeColumn, deleteTask, isEdit) {
    let Task = document.getElementById(id);
    let height = Task.getBoundingClientRect().height;
    let offsetHeight = Task.offsetHeight;
    if (!isEdit) {
        Task.onmousedown = function onmousedown(event) {

            if (event.target.className.indexOf('im') >= 0) return;
            let style = Task.style;
            Task.style.cursor = 'grabbing';

            let shiftX = event.clientX - Task.getBoundingClientRect().left;
            shiftX -= Task.style.marginLeft.slice(-Task.style.marginLeft.length + 1, -2);
            let shiftY = event.clientY - Task.getBoundingClientRect().top;
            shiftY -= Task.style.marginTop.slice(-Task.style.marginTop.length + 1, -2);

            let div = document.createElement('div');
            div.id = 'insertionPoint';
            div.className = Task.className.replace('task', '');
            div.style.padding = 0;
            div.style.paddingTop = height + 'px';
            div.style.background = '#a0837d';
            div.style.border = '';
            div.style.opacity = 1;
            div.style.margin = Task.style.margin;
            div.style.borderRadius = '5px';
            div.style.boxSizing = 'border-box';
            Task.before(div);
            console.log(offsetHeight, height, div.getBoundingClientRect().height);
            Task.style.position = 'absolute';
            Task.style.margin = 0;
            Task.style.zIndex = 1000;
            console.log(div.style);

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                Task.style.left = pageX - shiftX + 'px';
                Task.style.top = pageY - shiftY + 'px';
            }

            let currentDroppable = null;
            let Container = null;
            let moved = true;
            let index = null;
            let arrPos = null;
            let timer;
            let containerTop;
            let containerHeight;
            let isScrolling = false;

            function onMouseMove(event) {
                if (moved) {
                    Task.style.opacity = 0.9;
                    Task.style.backgroundColor = '#ddf2d6';
                    Task.style.borderRadius = '6px';
                    Task.style.transformOrigin = `${shiftX}px ${shiftY}px`;
                    Task.style.transform = 'rotate(3deg)';
                    moved = false;
                }
                console.log(div.offsetHeight, div.getBoundingClientRect().height);
                if (div.offsetHeight < height) {
                    div.style.height = height + 'px';
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
                    Task.style.opacity = 0.90;
                }

                let droppableBelow = (!elemBelow.closest('#delete')) ? elemBelow.closest('.droppable') :
                    elemBelow.closest('#delete');

                let containerBelow = elemBelow.closest('.container') || Container;

                let taskContainer = elemBelow.closest('.tasks-container');

                if (taskContainer) {
                    if (!containerTop) {
                        containerTop = taskContainer.getBoundingClientRect().top;
                        containerHeight = taskContainer.getBoundingClientRect().height;
                    }
                    if (event.pageY < containerTop + containerHeight / 4) {
                        taskContainer.scrollTop -= 10;
                        isScrolling = true;
                    } else if (event.pageY > containerTop + containerHeight * 3 / 4) {
                        taskContainer.scrollTop += 10;
                        isScrolling = true;
                    }


                } else {

                    containerTop = null;
                }

                if (containerBelow !== Container) {

                    if (Container) {
                        div.remove();
                    }

                    Container = containerBelow;

                    if (Container) {
                        Container.querySelector('.tasks-container').append(div);
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
                    if (!arrPos || isScrolling) {
                        isScrolling = false;
                        arrPos = [];
                        let elemselfH;
                        let elements = Array.from(currentDroppable.querySelectorAll('.task'));
                        for (let element of elements) {
                            if (element.id !== id) {
                                if (!elemselfH) {
                                    let pos = element.getBoundingClientRect().top +
                                        element.getBoundingClientRect().height / 2;
                                    arrPos.push({
                                        pos: pos,
                                        element: element,
                                    })
                                } else {
                                    let pos = element.getBoundingClientRect().top +
                                        element.getBoundingClientRect().height / 2 - elemselfH;
                                    arrPos.push({
                                        pos: pos,
                                        element: element,
                                    })
                                }
                            } else {
                                //elemselfH = element.getBoundingClientRect().height;
                            }
                        }
                    }

                    let lastIndex;
                    //console.log(arrPos);
                    for (let i in arrPos) {
                        if (arrPos[i].pos > event.pageY) {
                            lastIndex = i;
                            break;
                        }
                    }

                    if (lastIndex) {
                        if (index !== lastIndex || index == null) {
                            div.remove();
                            index = lastIndex;
                            arrPos[lastIndex].element.before(div);

                        }
                    } else {

                        currentDroppable.querySelector('.tasks-container').append(div);
                        index = null;
                    }

                } else {
                    index = null;
                    arrPos = null;
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            Task.onmouseup = function () {
                if (timer) {
                    clearInterval(timer);
                }
                document.removeEventListener('mousemove', onMouseMove);
                Task.onmouseup = null;
                Task.style = style;
                div.remove();
                console.log(arrPos);
                if (currentDroppable) {
                    leaveDroppable(currentDroppable);
                }
                if (currentDroppable && currentDroppable.id === 'delete') {
                    deleteTask(Task.id);
                    return;
                } else if (currentDroppable) {
                    changeColumn(Task.id, currentDroppable.id, index);
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