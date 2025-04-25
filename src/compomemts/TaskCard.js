import React, {useState} from 'react';
import { useBoard } from '../context/BoardContext';
import { Draggable } from 'react-beautiful-dnd';
import EditModal from './EditModal';

function TaskCard({ task, columnId, index }) {
    const { dispatch } = useBoard();
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = () => {
        dispatch({ type: 'DELETE_TASK', payload: task.id });
    };

    const toggleComplete = () => {
        dispatch({
            type: 'EDIT_TASK',
            payload: {
                id: task.id,
                updates: { completed: !task.completed },
            },
        });
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        border: '1px solid #ccc',
                        margin: '4px',
                        padding: '8px',
                        background: '#fff',
                        cursor: 'grab', // ← this makes it feel draggable
                    }}
                >
                    <div>
                        <input type="checkbox" checked={task.completed} onChange={toggleComplete} />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                        <div className="tags">
                            {task.tags.map((tag, i) => (
                                <span key={i} style={{ fontSize: '0.8em', marginRight: '5px', color: '#888' }}>
                  #{tag}
                </span>
                            ))}
                        </div>
                    )}

                    <button onClick={() => setIsEditing(true)}>Edit</button>

                    <EditModal
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        task={task}
                        onSave={(updatedTask) =>
                            dispatch({
                                type: 'EDIT_TASK',
                                payload: {
                                    id: task.id,
                                    updates: {
                                        title: updatedTask.title,
                                        tags: updatedTask.tags,
                                    },
                                },
                            })
                        }
                    />


                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </Draggable>
    );
}

export default TaskCard;
