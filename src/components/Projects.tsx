                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          حذف
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStages(project.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          المراحل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTasks(project.id)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <ListTodo className="h-3 w-3 mr-1" />
                          المهام
                        </Button>
                      </div>
                    </TableCell> 