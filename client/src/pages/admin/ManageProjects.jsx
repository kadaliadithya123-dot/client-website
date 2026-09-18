import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiX, HiCheck, HiOutlineDocumentText, HiOutlineCog } from "react-icons/hi";
import api from "../../services/api.js";

const emptyForm = {
  title: "",
  description: "",
  domain: "",
  technologies: "",
  videoLink: "",
  difficulty: "Intermediate",
  teamSize: 1,
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domains, setDomains] = useState([]);
  const [domainPanelOpen, setDomainPanelOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [renamingDomainId, setRenamingDomainId] = useState(null);
  const [renameDomainValue, setRenameDomainValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [currentPdf, setCurrentPdf] = useState("");
  const [removePdf, setRemovePdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineEditForm, setInlineEditForm] = useState(emptyForm);
  const [inlineThumbnail, setInlineThumbnail] = useState(null);
  const [inlineImages, setInlineImages] = useState(null);
  const [inlinePdf, setInlinePdf] = useState(null);
  const [inlineCurrentThumbnail, setInlineCurrentThumbnail] = useState("");
  const [inlineRemoveThumbnail, setInlineRemoveThumbnail] = useState(false);
  const [inlineCurrentImages, setInlineCurrentImages] = useState([]);
  const [inlineImagesToRemove, setInlineImagesToRemove] = useState([]);
  const [inlineCurrentPdf, setInlineCurrentPdf] = useState("");
  const [inlineRemovePdf, setInlineRemovePdf] = useState(false);
  const [savingInlineEdit, setSavingInlineEdit] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    api
      .get("/projects", { params: { admin: true, search, limit: 50 } })
      .then((res) => setProjects(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, [search]);

  const fetchDomains = () => {
    api
      .get("/domains")
      .then((res) => setDomains(res.data.data))
      .catch(() => {});
  };

  useEffect(fetchDomains, []);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setAddingDomain(true);
    try {
      await api.post("/domains", { name: newDomain.trim() });
      toast.success("Domain added");
      setNewDomain("");
      fetchDomains();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add domain");
    } finally {
      setAddingDomain(false);
    }
  };

  const handleDeleteDomain = async (domain) => {
    if (!window.confirm(`Delete domain "${domain.name}"?`)) return;
    try {
      await api.delete(`/domains/${domain._id}`);
      toast.success("Domain deleted");
      fetchDomains();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete domain");
    }
  };

  const startRenameDomain = (domain) => {
    setRenamingDomainId(domain._id);
    setRenameDomainValue(domain.name);
  };

  const saveRenameDomain = async (domain) => {
    if (!renameDomainValue.trim()) return;
    try {
      await api.put(`/domains/${domain._id}`, { name: renameDomainValue.trim() });
      toast.success("Domain renamed");
      setRenamingDomainId(null);
      fetchDomains();
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename domain");
    }
  };

  const resetFileState = () => {
    setThumbnail(null);
    setImages(null);
    setPdf(null);
    setCurrentThumbnail("");
    setRemoveThumbnail(false);
    setCurrentImages([]);
    setImagesToRemove([]);
    setCurrentPdf("");
    setRemovePdf(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, domain: domains[0]?.name || "" });
    resetFileState();
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setInlineEditingId(p._id);
    setInlineEditForm({
      title: p.title,
      description: p.description,
      domain: domains.some((domain) => domain.name === p.domain) ? p.domain : domains[0]?.name || "",
      technologies: (p.technologies || []).join(", "),
      videoLink: p.videoLink || "",
      difficulty: p.difficulty,
      teamSize: p.teamSize,
    });
    setInlineThumbnail(null);
    setInlineImages(null);
    setInlinePdf(null);
    setInlineCurrentThumbnail(p.thumbnail || "");
    setInlineRemoveThumbnail(false);
    setInlineCurrentImages(p.images || []);
    setInlineImagesToRemove([]);
    setInlineCurrentPdf(p.pdfUrl || "");
    setInlineRemovePdf(false);
  };

  const toggleInlineImageForRemoval = (img) => {
    setInlineImagesToRemove((prev) =>
      prev.includes(img) ? prev.filter((item) => item !== img) : [...prev, img]
    );
  };

  const handleInlineSave = async (projectId) => {
    setSavingInlineEdit(true);
    try {
      const data = new FormData();
      Object.entries(inlineEditForm).forEach(([key, value]) => data.append(key, value));
      if (inlineThumbnail) data.append("thumbnail", inlineThumbnail);
      if (inlineImages) Array.from(inlineImages).forEach((file) => data.append("images", file));
      if (inlinePdf) data.append("pdf", inlinePdf);

      data.append("removeThumbnail", inlineRemoveThumbnail ? "true" : "false");
      data.append("removePdf", inlineRemovePdf ? "true" : "false");
      data.append("imagesToRemove", inlineImagesToRemove.join(","));

      await api.put(`/projects/${projectId}`, data);
      toast.success("Project updated");
      setInlineEditingId(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project");
    } finally {
      setSavingInlineEdit(false);
    }
  };

  const toggleImageForRemoval = (img) => {
    setImagesToRemove((prev) =>
      prev.includes(img) ? prev.filter((item) => item !== img) : [...prev, img]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (thumbnail) data.append("thumbnail", thumbnail);
      if (images) Array.from(images).forEach((file) => data.append("images", file));
      if (pdf) data.append("pdf", pdf);

      if (editing) {
        data.append("removeThumbnail", removeThumbnail ? "true" : "false");
        data.append("removePdf", removePdf ? "true" : "false");
        data.append("imagesToRemove", imagesToRemove.join(","));
        await api.put(`/projects/${editing._id}`, data);
        toast.success("Project updated");
      } else {
        await api.post("/projects", data);
        toast.success("Project created");
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Manage Projects</h1>
          <p className="mt-1 text-sm text-steel">Create, edit and remove student/industry projects.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDomainPanelOpen(true)} className="btn-outline !border-black/10 !text-navy-900 hover:!bg-mist">
            <HiOutlineCog /> Manage Domains
          </button>
          <button onClick={openCreate} className="btn-primary">
            <HiOutlinePlus /> New Project
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects..."
        className="mt-5 w-full max-w-sm rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
      />

      <div className="mt-5 overflow-x-auto rounded-lg border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase text-steel">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-steel">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-steel">No projects found.</td></tr>
            ) : (
              projects.map((project) => (
                <Fragment key={project._id}>
                  <tr className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-navy-900">{project.title}</td>
                    <td className="px-4 py-3">{project.domain}</td>
                    <td className="px-4 py-3">{project.difficulty}</td>
                    <td className="px-4 py-3">{project.teamSize}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(project)} className="rounded-md p-2 text-brand-600 hover:bg-brand-50">
                          <HiOutlinePencil />
                        </button>
                        <button onClick={() => handleDelete(project._id)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {inlineEditingId === project._id && (
                    <tr className="bg-brand-50/60">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              required
                              value={inlineEditForm.title}
                              onChange={(e) => setInlineEditForm({ ...inlineEditForm, title: e.target.value })}
                              placeholder="Title"
                              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                            />
                            <select
                              value={inlineEditForm.domain}
                              onChange={(e) => setInlineEditForm({ ...inlineEditForm, domain: e.target.value })}
                              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                            >
                              {domains.map((domain) => (
                                <option key={domain._id} value={domain.name}>{domain.name}</option>
                              ))}
                            </select>
                          </div>
                          <textarea
                            required
                            rows={3}
                            value={inlineEditForm.description}
                            onChange={(e) => setInlineEditForm({ ...inlineEditForm, description: e.target.value })}
                            placeholder="Description"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                          />
                          <div className="grid gap-3 md:grid-cols-2">
                            <select
                              value={inlineEditForm.difficulty}
                              onChange={(e) => setInlineEditForm({ ...inlineEditForm, difficulty: e.target.value })}
                              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                            <input
                              type="number"
                              min={1}
                              value={inlineEditForm.teamSize}
                              onChange={(e) => setInlineEditForm({ ...inlineEditForm, teamSize: e.target.value })}
                              placeholder="Team Size"
                              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                            />
                          </div>
                          <input
                            value={inlineEditForm.technologies}
                            onChange={(e) => setInlineEditForm({ ...inlineEditForm, technologies: e.target.value })}
                            placeholder="Technologies (comma separated)"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                          />
                          <input
                            value={inlineEditForm.videoLink}
                            onChange={(e) => setInlineEditForm({ ...inlineEditForm, videoLink: e.target.value })}
                            placeholder="YouTube / Video Link"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                          />

                          <div>
                            <label className="text-xs font-medium text-steel">Thumbnail</label>
                            {inlineCurrentThumbnail && !inlineRemoveThumbnail && (
                              <div className="mt-2 flex items-center gap-3">
                                <img src={inlineCurrentThumbnail} alt="Current thumbnail" className="h-16 w-16 rounded-md object-cover" />
                                <button type="button" onClick={() => setInlineRemoveThumbnail(true)} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600">
                                  <HiOutlineTrash size={14} /> Remove
                                </button>
                              </div>
                            )}
                            {inlineRemoveThumbnail && (
                              <p className="mt-2 text-xs text-steel">
                                Thumbnail will be removed on save. {" "}
                                <button type="button" onClick={() => setInlineRemoveThumbnail(false)} className="font-medium text-brand-600">
                                  Undo
                                </button>
                              </p>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => { setInlineThumbnail(e.target.files[0]); setInlineRemoveThumbnail(false); }} className="mt-2 w-full text-sm" />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-steel">Gallery Images</label>
                            {inlineCurrentImages.length > 0 && (
                              <div className="mt-2 grid grid-cols-4 gap-2">
                                {inlineCurrentImages.map((image) => {
                                  const marked = inlineImagesToRemove.includes(image);
                                  return (
                                    <div key={image} className="group relative aspect-square overflow-hidden rounded-md">
                                      <img src={image} alt="" className={`h-full w-full object-cover ${marked ? "opacity-30" : ""}`} />
                                      <button type="button" onClick={() => toggleInlineImageForRemoval(image)} className={`absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full text-white ${marked ? "bg-brand-500" : "bg-black/60 opacity-0 group-hover:opacity-100"}`} title={marked ? "Undo remove" : "Remove image"}>
                                        {marked ? "↺" : <HiX size={14} />}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {inlineImagesToRemove.length > 0 && <p className="mt-1 text-xs text-steel">{inlineImagesToRemove.length} image(s) will be removed on save.</p>}
                            <input type="file" accept="image/*" multiple onChange={(e) => setInlineImages(e.target.files)} className="mt-2 w-full text-sm" />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-steel">Project PDF</label>
                            {inlineCurrentPdf && !inlineRemovePdf && (
                              <div className="mt-2 flex items-center gap-3">
                                <a href={inlineCurrentPdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"><HiOutlineDocumentText /> View current PDF</a>
                                <button type="button" onClick={() => setInlineRemovePdf(true)} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"><HiOutlineTrash size={14} /> Remove</button>
                              </div>
                            )}
                            {inlineRemovePdf && <p className="mt-2 text-xs text-steel">PDF will be removed on save. <button type="button" onClick={() => setInlineRemovePdf(false)} className="font-medium text-brand-600">Undo</button></p>}
                            <input type="file" accept="application/pdf" onChange={(e) => { setInlinePdf(e.target.files[0]); setInlineRemovePdf(false); }} className="mt-2 w-full text-sm" />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setInlineEditingId(null)} className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-steel hover:bg-white">Cancel</button>
                            <button type="button" onClick={() => handleInlineSave(project._id)} disabled={savingInlineEdit} className="btn-primary disabled:opacity-60">{savingInlineEdit ? "Saving..." : "Save"}</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-steel hover:text-navy-900"><HiX size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
              <textarea required rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400">
                  {domains.map((domain) => <option key={domain._id} value={domain.name}>{domain.name}</option>)}
                </select>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <input placeholder="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="YouTube / Video Link" value={form.videoLink} onChange={(e) => setForm({ ...form, videoLink: e.target.value })} className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
                <input type="number" min={1} placeholder="Team Size" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
              </div>

              <div>
                <label className="text-xs font-medium text-steel">Thumbnail</label>
                {currentThumbnail && !removeThumbnail && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={currentThumbnail} alt="Current thumbnail" className="h-16 w-16 rounded-md object-cover" />
                    <button type="button" onClick={() => setRemoveThumbnail(true)} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"><HiOutlineTrash size={14} /> Remove</button>
                  </div>
                )}
                {removeThumbnail && <p className="mt-2 text-xs text-steel">Thumbnail will be removed on save. <button type="button" onClick={() => setRemoveThumbnail(false)} className="font-medium text-brand-600">Undo</button></p>}
                <input type="file" accept="image/*" onChange={(e) => { setThumbnail(e.target.files[0]); setRemoveThumbnail(false); }} className="mt-2 w-full text-sm" />
              </div>

              <div>
                <label className="text-xs font-medium text-steel">Gallery Images (up to 8)</label>
                {currentImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {currentImages.map((image) => {
                      const marked = imagesToRemove.includes(image);
                      return (
                        <div key={image} className="group relative aspect-square overflow-hidden rounded-md">
                          <img src={image} alt="" className={`h-full w-full object-cover ${marked ? "opacity-30" : ""}`} />
                          <button type="button" onClick={() => toggleImageForRemoval(image)} className={`absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full text-white ${marked ? "bg-brand-500" : "bg-black/60 opacity-0 group-hover:opacity-100"}`} title={marked ? "Undo remove" : "Remove image"}>
                            {marked ? "↺" : <HiX size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {imagesToRemove.length > 0 && <p className="mt-1 text-xs text-steel">{imagesToRemove.length} image(s) will be removed on save.</p>}
                <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="mt-2 w-full text-sm" />
              </div>

              <div>
                <label className="text-xs font-medium text-steel">Project PDF</label>
                {currentPdf && !removePdf && (
                  <div className="mt-2 flex items-center gap-3">
                    <a href={currentPdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"><HiOutlineDocumentText /> View current PDF</a>
                    <button type="button" onClick={() => setRemovePdf(true)} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"><HiOutlineTrash size={14} /> Remove</button>
                  </div>
                )}
                {removePdf && <p className="mt-2 text-xs text-steel">PDF will be removed on save. <button type="button" onClick={() => setRemovePdf(false)} className="font-medium text-brand-600">Undo</button></p>}
                <input type="file" accept="application/pdf" onChange={(e) => { setPdf(e.target.files[0]); setRemovePdf(false); }} className="mt-2 w-full text-sm" />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? "Saving..." : editing ? "Update Project" : "Create Project"}</button>
            </form>
          </div>
        </div>
      )}

      {domainPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-6">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Manage Domains</h2>
              <button onClick={() => setDomainPanelOpen(false)} className="text-steel hover:text-navy-900">
                <HiX size={22} />
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="mt-4 flex gap-2">
              <input
                placeholder="New domain, e.g. NODE MCU BASED PROJECTS"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <button type="submit" disabled={addingDomain} className="btn-primary !px-4 disabled:opacity-60">
                {addingDomain ? "Adding..." : "Add"}
              </button>
            </form>

            <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
              {domains.length === 0 ? (
                <p className="text-sm text-steel">No domains yet - add one above.</p>
              ) : (
                domains.map((domain) => (
                  <div key={domain._id} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-mist">
                    {renamingDomainId === domain._id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input autoFocus value={renameDomainValue} onChange={(e) => setRenameDomainValue(e.target.value)} className="flex-1 rounded-md border border-black/10 px-2 py-1 text-sm outline-none focus:border-brand-400" />
                        <button onClick={() => saveRenameDomain(domain)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="Save"><HiCheck size={16} /></button>
                        <button onClick={() => setRenamingDomainId(null)} className="rounded-md p-1.5 text-steel hover:bg-mist" title="Cancel"><HiX size={16} /></button>
                      </div>
                    ) : (
                      <><span className="text-navy-900">{domain.name}</span><div className="flex gap-1"><button onClick={() => startRenameDomain(domain)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="Rename"><HiOutlinePencil size={15} /></button><button onClick={() => handleDeleteDomain(domain)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50" title="Delete domain"><HiOutlineTrash size={15} /></button></div></>
                    )}
                  </div>
                ))
              )}
            </div>
            <p className="mt-3 text-xs text-steel">
              A domain cannot be deleted while any project is still using it. Reassign those projects first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
