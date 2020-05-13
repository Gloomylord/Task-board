

export default function (column, changeTitlePlace, deleteColumn, isEdit) {
    let Title = document.getElementById(column);
    let Column = Title.closest('.droppable');
    let ContainerSelf = Title.closest('.container') ;
    let width = Column.getBoundingClientRect().width;
    let height = Column.getBoundingClientRect().height;
    if (!isEdit) {
        Title.onmousedown = function onmousedown(event) {
            if (event.target.className.indexOf('im') >= 0) return;
            let style = Column.style;
            Column.style.cursor = 'grabbing';

            let shiftX = event.clientX - Column.getBoundingClientRect().left;
            shiftX -= Column.style.marginLeft.slice(-Column.style.marginLeft.length + 1, -2);
            let shiftY = event.clientY - Column.getBoundingClientRect().top;
            shiftY -= Column.style.marginTop.slice(-Column.style.marginTop.length + 1, -2);

            let div = document.createElement('div');
            div.id = 'insertionPoint';
            div.style.height = '100%';
            div.style.paddingTop = '30px';
            let div1 = document.createElement('div');
            div1.id = 'insteadColumn';
            div1.className = Column.className;
            div1.style.width = width + 'px';
            div1.style.height = height + 'px';
            div1.style.background = 'rgba(32,34,36,0.29)';
            div1.style.borderRadius = '6px';
            div.append(div1);
            ContainerSelf.before(div);
            Column.style.position = 'absolute';
            Column.style.margin = 0;
            Column.style.zIndex = 1000;


            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                Column.style.left = pageX - shiftX + 'px';
                Column.style.top = pageY - shiftY + 'px';
            }

            let currentDroppable = null;
            let Container = null;
            let moved = true;
            let columnBelow = null;
            let isBefore = true;

            function onMouseMove(event) {
                if (moved) {
                    Column.style.transformOrigin = `${shiftX}px ${shiftY}px`;
                    Column.style.transform = 'rotate(3deg)';
                    Column.style.boxShadow = ' 0px 0px 1px  rgba(0,0,0,0.5)';
                    moved = false;
                }

                moveAt(event.pageX, event.pageY);

                Column.style.visibility = 'hidden';
                let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                Column.style.visibility = 'visible';

                if (!elemBelow) {
                    div.remove();
                    document.removeEventListener('mousemove', onMouseMove);
                    Column.style = style;
                    ContainerSelf.style.visibility = 'visible';
                    return;
                }

                if (elemBelow.id === 'delete') {
                    Column.style.opacity = 0.3;
                } else {
                    Column.style.opacity = 1;
                }

                let droppableBelow = elemBelow.closest('#delete');

                let containerBelow = elemBelow.closest('.container');

                if (containerBelow ) {

                    Container = containerBelow ;

                    if (Container) {
                        div.remove();
                        let center = Container.getBoundingClientRect().left +
                            Container.getBoundingClientRect().width / 2;
                        if(columnBelow !== Container.querySelector('.droppable').id ) {
                            if (center > event.pageX) {
                                Container.after(div);
                                columnBelow = Container.querySelector('.droppable').id;
                                isBefore = false;
                            } else {
                                Container.before(div);
                                columnBelow = Container.querySelector('.droppable').id;
                                isBefore = true;
                            }
                        } else {
                            if (isBefore) {
                                Container.after(div);
                                isBefore = false;
                            } else {
                                Container.before(div);
                                isBefore = true;
                            }
                        }
                    }
                }


                if (droppableBelow && droppableBelow.id === 'delete') {
                    div.remove();
                    Container = null;
                }

                if (currentDroppable !== droppableBelow) {

                    if (currentDroppable) {
                        leaveDroppable(currentDroppable);
                        columnBelow = null;
                    }

                    currentDroppable = droppableBelow;

                    if (currentDroppable) {
                        enterDroppable(currentDroppable);
                    }
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            Column.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                Column.onmouseup = null;
                Column.style = style;
                div.remove();
                if (columnBelow === null) return;

                if (currentDroppable) {
                    leaveDroppable(currentDroppable);
                }

                if (currentDroppable && currentDroppable.id === 'delete') {
                    deleteColumn(column.slice(1));
                    return;
                } else if (Container) {
                    changeTitlePlace(column.slice(1), columnBelow, isBefore);
                }
                columnBelow = null;
            };

        };

        function enterDroppable(elem) {
            if (elem.id === 'delete') {
                elem.style.backgroundImage = 'url(82-512.webp), linear-gradient(45deg, #f8a261, #6e9fc9)';
                elem.style.transform = 'scale(1.1)';
            }

        }

        function leaveDroppable(elem) {
            if (elem.id === 'delete') {
                elem.style.background = '';
                elem.style.border = ``;
                elem.style.transform = '';
            }
        }

        Column.ondragstart = function () {
            return false;
        };
    }
}