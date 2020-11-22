  
import { Component } from "react";
import { DragDropContext, Droppable, Draggable, resetServerContext  } from "react-beautiful-dnd";

import keys from '../../../config/keys'
import ListElement from './list-element'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getElementStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? keys.APP_COLOR_GRAY_LIGHT : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? keys.APP_COLOR_GRAY_LIGHT : "white",
    // padding: grid,
    width: '100%'
});

class DraggableList extends Component {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // console.log("E: ", result)
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        
        let source = result.source.index
        let destination = result.destination.index

        const elements = reorder(
            this.props.elements,
            result.source.index,
            result.destination.index
        );

        this.props.setElements(elements, source, destination);
    }
    
    renderElement(element, elementWrapper, index) {
        //For Stage Editor
        if (element.name) {
            return elementWrapper(index, element)
        }
        //For Side Editor
        return elementWrapper(index, element)
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const {wrapper, customKey} = this.props
        resetServerContext()
        
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {this.props.elements.map((element, index) => (
                                <Draggable 
                                    key={(customKey ? customKey : '') + index} 
                                    draggableId={(customKey ? customKey : '') + index} 
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        style={getElementStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        {this.renderElement(element, wrapper, index)}
                                    </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default DraggableList

// import { Component } from "react";
// import { DragDropContext, Droppable, Draggable, resetServerContext  } from "react-beautiful-dnd";
// resetServerContext()
// import keys from '../../../config/keys'

// // a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);

//     return result;
// };

// const getElementStyle = (isDragging, draggableStyle) => ({
//     // some basic styles to make the items look a bit nicer
//     userSelect: "none",
//     // margin: `0 0 ${grid}px 0`,

//     // change background colour if dragging
//     background: isDragging ? keys.APP_COLOR_GRAY_LIGHT : "white",

//     // styles we need to apply on draggables
//     ...draggableStyle
// });

// const getListStyle = isDraggingOver => ({
//     background: isDraggingOver ? keys.APP_COLOR_GRAY_LIGHT : "white",
//     // padding: grid,
//     width: '100%'
// });

// class DraggableList extends Component {
//     constructor(props) {
//         super(props);
//         this.onDragEnd = this.onDragEnd.bind(this);
//     }

//     onDragEnd(result) {
//         // console.log("E: ", result)
//         // dropped outside the list
//         if (!result.destination) {
//             return;
//         }
        
//         let source = result.source.index
//         let destination = result.destination.index

//         const elements = reorder(
//             this.props.elements,
//             result.source.index,
//             result.destination.index
//         );

//         this.props.setElements(elements, source, destination);
//     }
    
//     renderElement(element, elementWrapper, index) {
//         return elementWrapper(index, element)
//     }

//     // Normally you would want to split things out into separate components.
//     // But in this example everything is just done in one place for simplicity
//     render() {
//         const elementWrapper = this.props.wrapper
//         return (
//             <DragDropContext 
//                 onDragEnd={this.onDragEnd}
//             >
//                 <Droppable droppableId="droppable">
//                     {(provided, snapshot) => (
//                         <div
//                             {...provided.droppableProps}
//                             ref={provided.innerRef}
//                             style={getListStyle(snapshot.isDraggingOver)}
//                         >
//                             {this.props.elements.map((element, index) => {
//                                 console.log("E: ", element)
//                                 return (
//                                     <Draggable draggableId={element.id} index={index}>
//                                         {(provided, snapshot) => (
//                                         <div
//                                             ref={provided.innerRef}
//                                                 {...provided.draggableProps}
//                                                 {...provided.dragHandleProps}
//                                             style={getElementStyle(
//                                                 snapshot.isDragging,
//                                                 provided.draggableProps.style
//                                             )}
//                                         >
//                                             {this.renderElement(element, elementWrapper, index)}
//                                         </div>
//                                         )}
//                                     </Draggable>
//                                 )
//                             })}
//                             {provided.placeholder}
//                         </div>
//                     )}
//                 </Droppable>
//             </DragDropContext>
//         );
//     }
// }

// export default DraggableList
