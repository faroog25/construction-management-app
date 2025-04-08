import React from 'react';
import apiDocs from '../data/api-docs.json';
import { Copy, Check, Search, Info, ChevronRight, ChevronDown, Code, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [jsonViewEndpoints, setJsonViewEndpoints] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState<string>("interactive");

  const entityDescriptions = {
    Project: {
      description: "The Project entity represents a construction project with its associated stages and tasks. Each project has a budget, timeline, and client information.",
      fields: {
        id: "Unique identifier for the project",
        name: "Name of the project",
        description: "Detailed description of the project",
        startDate: "Project start date (YYYY-MM-DD)",
        endDate: "Project end date (YYYY-MM-DD)",
        status: "Current status of the project (active, completed, on_hold)",
        budget: "Total budget allocated for the project",
        client: "Name of the client associated with the project"
      }
    },
    Task: {
      description: "The Task entity represents individual tasks within a project that need to be completed. Tasks can be assigned to team members and have priorities and deadlines.",
      fields: {
        id: "Unique identifier for the task",
        name: "Name of the task",
        description: "Detailed description of the task",
        startDate: "Task start date (YYYY-MM-DD)",
        endDate: "Task end date (YYYY-MM-DD)",
        status: "Current status of the task (pending, in_progress, completed)",
        priority: "Priority level of the task (low, medium, high)",
        projectId: "ID of the associated project",
        assignedTo: "ID of the user assigned to the task"
      }
    },
    Stage: {
      description: "The Stage entity represents different phases or stages within a project. Stages help organize the project timeline and track progress.",
      fields: {
        id: "Unique identifier for the stage",
        name: "Name of the stage",
        description: "Detailed description of the stage",
        startDate: "Stage start date (YYYY-MM-DD)",
        endDate: "Stage end date (YYYY-MM-DD)",
        status: "Current status of the stage (active, completed, on_hold)",
        projectId: "ID of the associated project"
      }
    }
  };

  const endpointDescriptions = {
    Project: {
      getProjects: {
        description: "Retrieves a list of all projects in the system. The response includes project details, budget, and timeline information.",
        parameters: [],
        example: {
          request: null,
          response: {
            projects: [
              {
                id: "1",
                name: "New Office Building",
                description: "Construction of a new office building",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                status: "active",
                budget: 5000000,
                client: "ABC Corporation"
              }
            ]
          }
        }
      },
      createProject: {
        description: "Creates a new project in the system. Requires project name, description, timeline, and budget information.",
        parameters: [],
        example: {
          request: {
            name: "New Office Building",
            description: "Construction of a new office building",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            budget: 5000000,
            client: "ABC Corporation"
          },
          response: {
            id: "1",
            name: "New Office Building",
            description: "Construction of a new office building",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            status: "active",
            budget: 5000000,
            client: "ABC Corporation"
          }
        }
      }
    }
  };

  const fieldDescriptions = {
    id: "Unique identifier for the entity",
    name: "Name of the entity",
    description: "Detailed description of the entity",
    startDate: "Start date of the entity",
    endDate: "End date of the entity",
    status: "Current status of the entity",
    budget: "Budget allocated for the project",
    client: "Client associated with the project",
    priority: "Priority level of the task (low, medium, high)",
    projectId: "ID of the associated project",
    assignedTo: "ID of the user assigned to the task"
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyToClipboard = (text: string, endpointName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(endpointName);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredDocs = React.useMemo(() => {
    if (!searchQuery) return apiDocs;

    const query = searchQuery.toLowerCase();
    const filtered: any = {};

    Object.entries(apiDocs).forEach(([entityName, entity]) => {
      const filteredEndpoints: any = {};
      
      Object.entries(entity.endpoints).forEach(([endpointName, endpoint]: [string, any]) => {
        const matchesSearch = 
          endpointName.toLowerCase().includes(query) ||
          endpoint.url.toLowerCase().includes(query) ||
          endpoint.method.toLowerCase().includes(query) ||
          endpoint.description.toLowerCase().includes(query);

        if (matchesSearch) {
          filteredEndpoints[endpointName] = endpoint;
        }
      });

      if (Object.keys(filteredEndpoints).length > 0) {
        filtered[entityName] = {
          ...entity,
          endpoints: filteredEndpoints
        };
      }
    });

    return filtered;
  }, [searchQuery]);

  const renderField = (field: any, name: string, level: number = 0, entityName: string) => {
    const isExpanded = expandedSections[`${name}-${level}`];
    const hasChildren = field.type === 'object' || field.type === 'array';
    const fieldDescription = entityDescriptions[entityName]?.fields?.[name];

    return (
      <div key={name} className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{'  '.repeat(level)}</span>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleSection(`${name}-${level}`)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Button>
          )}
          <code className="text-sm font-medium text-blue-600">"{name}"</code>
          <span className="text-gray-400">:</span>
          {typeof field === 'object' ? (
            <code className="text-sm text-gray-600">
              {field.type === 'array' ? 'Array' : 'Object'}
            </code>
          ) : (
            <code className="text-sm text-gray-600">{field}</code>
          )}
          {fieldDescription && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={14} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{fieldDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            {field.type === 'array' ? (
              <div>
                <span className="text-gray-400">[</span>
                <div className="pl-4">
                  {Object.entries(field.items).map(([itemName, item]: [string, any]) => 
                    renderField(item, itemName, level + 1, entityName)
                  )}
                </div>
                <span className="text-gray-400">{'  '.repeat(level)}]</span>
              </div>
            ) : (
              <div>
                <span className="text-gray-400">{'{'}</span>
                <div className="pl-4">
                  {Object.entries(field).map(([childName, child]: [string, any]) => 
                    renderField(child, childName, level + 1, entityName)
                  )}
                </div>
                <span className="text-gray-400">{'  '.repeat(level) + '}'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const toggleJsonView = (endpointName: string) => {
    setJsonViewEndpoints(prev => ({
      ...prev,
      [endpointName]: !prev[endpointName]
    }));
  };

  const renderEndpointJson = (endpoint: any, entityName: string) => {
    const requestData = {
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      },
      body: endpoint.body || null
    };

    const responseData = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: endpoint.response || null
    };

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Request</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(requestData, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Response</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        </div>

        {endpointDescriptions[entityName]?.[endpoint.name]?.example && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Example</h4>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <Tabs defaultValue="request" className="w-full">
                <TabsList>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
                <TabsContent value="request">
                  <pre className="text-sm">
                    {JSON.stringify(endpointDescriptions[entityName][endpoint.name].example.request, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="response">
                  <pre className="text-sm">
                    {JSON.stringify(endpointDescriptions[entityName][endpoint.name].example.response, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEndpoint = (endpoint: any, name: string, entityName: string) => {
    const isExpanded = expandedSections[name];
    const showJson = jsonViewEndpoints[name];
    
    return (
      <div key={name} className="mb-8 p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleSection(name)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Button>
            <Badge variant="outline" className={getMethodColor(endpoint.method)}>
              {endpoint.method}
            </Badge>
            <code className="text-sm bg-gray-50 px-3 py-1 rounded-md border">{endpoint.url}</code>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleJsonView(name)}
              className="flex items-center gap-2"
            >
              <Code size={16} />
              {showJson ? 'Hide JSON' : 'Show JSON'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => copyToClipboard(endpoint.url, name)}
            >
              {copied === name ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-8 space-y-4">
            <p className="text-sm text-gray-600">{endpointDescriptions[entityName]?.[name]?.description}</p>

            <Tabs defaultValue={showJson ? "json" : "interactive"} className="w-full">
              <TabsList>
                <TabsTrigger value="interactive">Interactive</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="interactive">
                {endpoint.body && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Request Body</h4>
                    <div className="relative bg-gray-50 p-4 rounded-md border">
                      <span className="text-gray-400">{'{'}</span>
                      {Object.entries(endpoint.body).map(([fieldName, field]: [string, any]) => 
                        renderField(field, fieldName, 1, entityName)
                      )}
                      <span className="text-gray-400">{'}'}</span>
                    </div>
                  </div>
                )}

                {endpoint.response && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Response</h4>
                    <div className="relative bg-gray-50 p-4 rounded-md border">
                      {endpoint.response.type === 'array' ? (
                        <div>
                          <span className="text-gray-400">[</span>
                          <div className="pl-4">
                            {Object.entries(endpoint.response.items).map(([fieldName, field]: [string, any]) => 
                              renderField(field, fieldName, 1, entityName)
                            )}
                          </div>
                          <span className="text-gray-400">]</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-gray-400">{'{'}</span>
                          {Object.entries(endpoint.response).map(([fieldName, field]: [string, any]) => 
                            renderField(field, fieldName, 1, entityName)
                          )}
                          <span className="text-gray-400">{'}'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="json">
                {renderEndpointJson(endpoint, entityName)}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  };

  const renderEntity = (entity: any, name: string) => {
    const isExpanded = expandedSections[name];
    
    return (
      <div key={name} className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleSection(name)}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {name.charAt(0)}
            </span>
            {name}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{entityDescriptions[name]?.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isExpanded && (
          <div className="pl-8 space-y-6">
            {Object.entries(entity.endpoints).map(([endpointName, endpoint]) => 
              renderEndpoint(endpoint, endpointName, name)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">API Documentation</h1>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink size={16} />
              Open in Postman
            </Button>
          </div>
          <p className="text-gray-600 mb-6">
            Welcome to the API documentation. Here you'll find all the endpoints available for the Project, Task, and Stage entities.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search endpoints..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-12">
          {Object.entries(filteredDocs).map(([entityName, entity]) => 
            renderEntity(entity, entityName)
          )}
          {Object.keys(filteredDocs).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No endpoints found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDocs; 