import { useState, useEffect } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Inertia } from "@inertiajs/inertia";
import useDarkMode from "@/Theme/useDarkMode"; // ✅ Dark Mode Hook eklendi

export default function Tasks({ tasks = [], categories = [] }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [theme] = useDarkMode(); // ✅ Dark mode state

    const getFilteredTasks = (status) => tasks.filter(task => task.status === status);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceColumn = source.droppableId;
        const destinationColumn = destination.droppableId;

        if (sourceColumn === destinationColumn) return;

        const movedTask = tasks.find(task => task.id.toString() === result.draggableId);
        if (!movedTask) return;

        const updatedStatus = destinationColumn === "pending" ? 0 :
                              destinationColumn === "ongoing" ? 1 : 2;

        Inertia.put(`/tasks/${movedTask.id}/toggle-status`, {
            status: updatedStatus
        }, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Task status güncellenirken hata oluştu:", errors);
            }
        });
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["pending", "ongoing", "completed"].map((statusKey) => (
                        <Droppable key={statusKey} droppableId={statusKey}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`shadow-lg rounded-xl p-6 transition ${
                                        statusKey === "completed" ? "border-green-500" : ""
                                    } bg-white dark:bg-gray-600`}
                                >
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 tracking-wide mb-4">
                                        {statusKey === "pending"
                                            ? "📝 Pending Tasks"
                                            : statusKey === "ongoing"
                                            ? "🕒 Ongoing Tasks"
                                            : "✅ Completed Tasks"}
                                    </h3>

                                    {getFilteredTasks(
                                        statusKey === "pending" ? 0 :
                                        statusKey === "ongoing" ? 1 : 2
                                    ).length > 0 ? (
                                        <div className="space-y-4">
                                            {getFilteredTasks(
                                                statusKey === "pending" ? 0 :
                                                statusKey === "ongoing" ? 1 : 2
                                            ).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="transition transform hover:scale-[1.02]"
                                                        >
                                                            <TaskItem
                                                                task={task}
                                                                categoryName={categories.find(c => c.id === task.category_id)?.name || "Uncategorized"}
                                                                onEdit={() => {
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
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-center italic">
                                            {statusKey === "pending"
                                                ? "No pending tasks. 🎉"
                                                : statusKey === "ongoing"
                                                ? "No ongoing tasks. 🎯"
                                                : "No completed tasks yet. 🚀"}
                                        </p>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
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
