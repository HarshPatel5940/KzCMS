import { ObjectId } from 'mongodb';
import database from '../../loaders/database';

interface Project {
  slug: string;
  name: string;
}

interface ImageData {
  slug: string;
  title: string;
  image: File;
}

interface UpdatedProjectData {
  data: {
    title: string;
    description: string;
    link: string;
    author: string;
  };
}

interface ProjectData {
  slug: string;
  data: {
    title: string;
    description: string;
    imageURL: string;
    link: string;
    author: string;
  }[];
}

export const handleGetAllProjects = async (): Promise<Project[]> => {
  return [];
};

export const handleGetProject = async (slug: string): Promise<ProjectData> => {
  return { slug, data: [] };
};

export const handleCreateProject = async (project: Project): Promise<Project> => {
  return project;
};

export const handleCreateProjects = async (): Promise<unknown[]> => {
  return [];
};

export const handleUpdateProject = async (
  slug: string,
  data: {
    title: string;
    description?: string;
    link?: string;
    author?: string;
  },
): Promise<UpdatedProjectData & any> => {
  const projectsCollection = (await database()).collection('projects');
  const project = await projectsCollection.findOne({ projectSlug: slug, 'data.title': data.title });
  if (project) {
    const filter = { _id: new ObjectId(project._id), 'data.title': data.title };

    const update = {
      $set: {
        'data.$.title': data.title,
        'data.$.description': data.description,
        'data.$.link': data.link,
        'data.$.author': data.author,
      },
    };

    const updatedProject = await projectsCollection.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
      projection: { _id: 0 },
    });

    return { updatedProject: updatedProject.value };
  }
  throw { success: false, message: `Project with slug '${slug}' or title '${data.title}' not found`, data };
};

export const handleDeleteProject = async (slug: string): Promise<unknown> => {
  //delete a specific project
  return { success: true, message: `${slug} deleted` };
};

export const handlePostImage = async (data: {
  slug: string;
  title: string;
  image: File;
}): Promise<{ data: ImageData }> => {
  // post an image
  return { data };
};

export const handleDeleteImage = async (slug: string, title: string, imageUrl: string): Promise<unknown> => {
  return { success: true, message: `${imageUrl} deleted from ${title} of project ${slug}` };
};
