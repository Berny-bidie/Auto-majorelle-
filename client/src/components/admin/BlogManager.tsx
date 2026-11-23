import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Notice } from "@/components/site/Shared";
import { slugify } from "@/lib/site";
import { trpc } from "@/lib/trpc";

type PostRow={id:number;slug:string;title:string;category:string;excerpt:string;body:string;imageUrl:string;author:string|null;readingMinutes:number;status:"draft"|"published";reviewNotes:string|null;publishedAt:Date|null};
type PostDraft={title:string;slug:string;category:string;excerpt:string;body:string;imageUrl:string;author:string;readingMinutes:string;status:"draft"|"published";reviewNotes:string};
const blank:PostDraft={title:"",slug:"",category:"Conseils",excerpt:"",body:"",imageUrl:"",author:"automajorelle",readingMinutes:"5",status:"draft",reviewNotes:""};
function fromRow(row:PostRow):PostDraft{return{title:row.title,slug:row.slug,category:row.category,excerpt:row.excerpt,body:row.body,imageUrl:row.imageUrl,author:row.author||"",readingMinutes:String(row.readingMinutes),status:row.status,reviewNotes:row.reviewNotes||""};}

export default function BlogManager(){
  const utils=trpc.useUtils();const query=trpc.automajorel.admin.posts.useQuery();const [draft,setDraft]=useState<PostDraft|null>(null);const [editingId,setEditingId]=useState<number|undefined>();const [message,setMessage]=useState("");const [error,setError]=useState("");
  const saved=()=>{setDraft(null);setEditingId(undefined);setMessage("Article enregistré.");setError("");void utils.automajorel.admin.posts.invalidate();void utils.automajorel.blog.list.invalidate();};
  const save=trpc.automajorel.admin.savePost.useMutation({onSuccess:saved,onError:()=>setError("Enregistrement impossible. Vérifiez le titre, l’URL et le contenu." )});
  const remove=trpc.automajorel.admin.deletePost.useMutation({onSuccess:()=>{setMessage("Article supprimé.");void utils.automajorel.admin.posts.invalidate();void utils.automajorel.blog.list.invalidate();},onError:()=>setError("Suppression impossible.")});
  const create=()=>{setEditingId(undefined);setDraft({...blank});setMessage("");};
  const edit=(row:PostRow)=>{setEditingId(row.id);setDraft(fromRow(row));setMessage("");};
  const field=(key:keyof PostDraft,value:string)=>setDraft(current=>current?({...current,[key]:value,...(key==="title"?{slug:slugify(value)}:{})}):current);
  const submit=(event:FormEvent)=>{event.preventDefault();if(!draft)return;if(draft.status==="published"&&draft.reviewNotes.trim()&&!window.confirm("Cet article comporte encore des points à vérifier. Publier quand même après votre relecture ?"))return;save.mutate({id:editingId,slug:draft.slug,title:draft.title,category:draft.category,excerpt:draft.excerpt,body:draft.body,imageUrl:draft.imageUrl,author:draft.author||null,readingMinutes:Number(draft.readingMinutes),status:draft.status,reviewNotes:draft.reviewNotes||null});};
  return <>
    <div className="admin-title-row"><div><span className="eyebrow">CONTENUS & BLOG</span><h1>Articles</h1></div><button className="button button-red" onClick={create}><Plus size={15}/> Nouvel article</button></div>
    <div className="admin-warning">Les six articles du site source sont conservés en brouillons. Plusieurs contiennent des taux, garanties, chiffres de stock ou comparatifs non confirmés; ils ne sont pas visibles publiquement tant qu’ils restent en brouillon.</div>
    {message&&<Notice kind="success">{message}</Notice>}{error&&<Notice kind="error">{error}</Notice>}
    {draft&&<div className="admin-card"><h2>{editingId?"Modifier l’article":"Créer un article"}</h2><form className="admin-form" onSubmit={submit}>
      <div className="field-full"><label>Titre *</label><input required minLength={4} maxLength={220} value={draft.title} onChange={e=>field("title",e.target.value)}/></div>
      <div><label>Slug URL *</label><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={e=>field("slug",e.target.value)}/></div><div><label>Catégorie *</label><input required maxLength={80} value={draft.category} onChange={e=>field("category",e.target.value)}/></div>
      <div><label>Auteur</label><input maxLength={120} value={draft.author} onChange={e=>field("author",e.target.value)}/></div><div><label>Temps de lecture (minutes)</label><input type="number" min="1" max="120" value={draft.readingMinutes} onChange={e=>field("readingMinutes",e.target.value)}/></div>
      <div className="field-full"><label>Résumé *</label><textarea required minLength={10} maxLength={1000} value={draft.excerpt} onChange={e=>field("excerpt",e.target.value)}/></div>
      <div className="field-full"><label>Image (URL ou chemin stockage)</label><input maxLength={1000} value={draft.imageUrl} onChange={e=>field("imageUrl",e.target.value)}/></div>
      <div className="field-full"><label>Contenu Markdown *</label><textarea required minLength={30} maxLength={12000} style={{minHeight:240}} value={draft.body} onChange={e=>field("body",e.target.value)}/></div>
      <div className="field-full"><label>Notes de vérification (conservez-les jusqu’à vérification)</label><textarea maxLength={4000} value={draft.reviewNotes} onChange={e=>field("reviewNotes",e.target.value)}/></div>
      <div><label>Publication</label><select value={draft.status} onChange={e=>field("status",e.target.value as PostDraft["status"])}><option value="draft">Brouillon</option><option value="published">Publié</option></select></div>
      <div className="field-full form-actions"><button className="button button-red" type="submit" disabled={save.isPending}>{save.isPending?"Enregistrement…":"Enregistrer l’article"}</button><button className="button button-outline" type="button" onClick={()=>setDraft(null)}>Annuler</button></div>
    </form></div>}
    <div className="admin-card"><h2>Bibliothèque éditoriale ({query.data?.length??0})</h2>{query.isLoading?<p>Chargement…</p>:query.data?.map(row=>{const post=row as PostRow;return <div className="admin-row" key={post.id}><div><h3>{post.title}</h3><p>{post.category} · {post.readingMinutes} min · <span className={`admin-status admin-status-${post.status}`}>{post.status==="draft"?"Brouillon":"Publié"}</span></p>{post.reviewNotes&&<div className="admin-warning">À vérifier : {post.reviewNotes}</div>}</div><div className="admin-row-actions"><button className="button button-outline button-small" onClick={()=>edit(post)}><Pencil size={13}/> Modifier</button><button className="button button-outline button-small" onClick={()=>{if(window.confirm(`Supprimer l’article « ${post.title} » ?`))remove.mutate({id:post.id});}}><Trash2 size={13}/> Supprimer</button></div></div>;})}</div>
  </>;
}
