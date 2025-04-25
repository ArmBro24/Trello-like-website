import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, onClose, task, onSave }) {
    const [value, setValue] = useState('');
    const [tags, setTags] = useState('');

    const isBoard = task && !('tags' in task) && !('tasks' in task);
    const isColumn = task && !('tags' in task) && 'tasks' in task;

    useEffect(() => {
        if (task) {
            setValue(task.title || task.name || '');
            setTags(task.tags ? task.tags.join(', ') : '');
        }
    }, [task]);

    const handleSubmit = () => {
        if (!task) return;

        const updated = { ...task };

        if (isBoard || isColumn) {
            updated.name = value;
        } else {
            updated.title = value;
            updated.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        onSave(updated);
        onClose();
    };

    if (!isOpen || !task) return null;

    return (
        <div style={backdrop}>
            <div style={modal}>
                <h3>{isBoard ? 'Edit Board' : isColumn ? 'Edit Column' : 'Edit Task'}</h3>
                <input
                    type="text"
                    placeholder={isBoard || isColumn ? 'Name' : 'Task title'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={input}
                />
                {!isBoard && !isColumn && (
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={input}
                    />
                )}
                <div style={{ marginTop: '10px' }}>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const backdrop = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
};

const modal = {
    background: '#fff', padding: '20px', borderRadius: '8px', width: '300px'
};

const input = {
    width: '100%', padding: '8px', marginTop: '8px'
};

export default EditModal;
