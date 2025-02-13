import { useState, useEffect } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Inertia } from "@inertiajs/inertia";

export default function Tasks({ tasks = [], categories = [], updateTasks }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        setPendingTasks(tasks.filter((task) => !task.is_completed));
        setCompletedTasks(tasks.filter((task) => task.is_completed));
    }, [tasks]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        let movedTask;
        let newPendingTasks = [...pendingTasks];
        let newCompletedTasks = [...completedTasks];

        if (source.droppableId === "pendingTasks") {
            movedTask = newPendingTasks.splice(source.index, 1)[0];
            movedTask.is_completed = true;
            newCompletedTasks.splice(destination.index, 0, movedTask);
        } else {
            movedTask = newCompletedTasks.splice(source.index, 1)[0];
            movedTask.is_completed = false;
            newPendingTasks.splice(destination.index, 0, movedTask);
        }

        setPendingTasks(newPendingTasks);
        setCompletedTasks(newCompletedTasks);
        updateTasks([...newPendingTasks, ...newCompletedTasks]);

        Inertia.put(`/tasks/${movedTask.id}/toggle-complete`, {
            is_completed: destination.droppableId === "completedTasks",
        });
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Droppable droppableId="pendingTasks">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Pending Tasks</h3>
                                {pendingTasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TaskItem
                                                    task={task}
                                                    categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                                    onEdit={(task) => {
                                                        setSelectedTask(task);
                                                        setModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="completedTasks">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Completed Tasks</h3>
                                {completedTasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TaskItem
                                                    task={task}
                                                    categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                                    onEdit={(task) => {
                                                        setSelectedTask(task);
                                                        setModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            {modalOpen && (
                <TaskForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                />
            )}
        </>
    );
}
