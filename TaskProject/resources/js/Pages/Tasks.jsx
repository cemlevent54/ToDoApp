import { useState } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Inertia } from "@inertiajs/inertia";
import useDarkMode from "@/Theme/useDarkMode"; 

export default function Tasks({ tasks = [], categories = [], isArchived }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState(0); 
    const [theme] = useDarkMode(); 

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
                    {[ 
                        { key: "pending", label: "📝 Pending Tasks", status: 0 },
                        { key: "ongoing", label: "🕒 Ongoing Tasks", status: 1 },
                        { key: "completed", label: "✅ Completed Tasks", status: 2 }
                    ].map(({ key, label, status }) => (
                        <Droppable key={key} droppableId={key}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`shadow-lg rounded-xl p-6 transition ${
                                        key === "completed" ? "border-green-500" : ""
                                    } bg-white dark:bg-gray-600`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
                                            {label}
                                        </h3>

                                        {/* ✅ + Butonu - Tıklanınca defaultStatus ve arşiv durumu ayarlanıyor */}
                                        <button 
                                            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-lg"
                                            onClick={() => {
                                                setDefaultStatus(status);
                                                setSelectedTask(null);
                                                setModalOpen(true);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {getFilteredTasks(status).length > 0 ? (
                                        <div className="space-y-4">
                                            {getFilteredTasks(status).map((task, index) => (
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
                                            {status === 0
                                                ? "No pending tasks. 🎉"
                                                : status === 1
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

            {/* ✅ TaskForm Açıldığında Default Status ve isArchived Ayarlanıyor */}
            {modalOpen && (
                <TaskForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                    defaultStatus={defaultStatus}
                    isArchived={isArchived} // ✅ Arşiv durumu parametre olarak gönderildi
                />
            )}
        </>
    );
}
