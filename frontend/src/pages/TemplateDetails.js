import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import TemplateHeader from "../components/template/TemplateHeader";
import TemplateTabs from "../components/template/TemplateTabs";
import EditTemplateForm from "../components/template/form/EditTemplateForm";
import QuestionList from "../components/template/QuestionList";
import ResultsTable from "../components/template/ResultsTable";
import TemplateStats from "../components/template/TemplateStats";
import GeneralSettings from "../components/template/GeneralSettings";
import { useTemplate } from "../hooks/useTemplate";
import DeleteTemplateModal from "../components/template/DeleteTemplateModal";
import TemplateSettings from "../components/template/TemplateSettings";

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    template,
    forms,
    aggregatedResults,
    error,
    loading,
    fetchAggregation,
    hasAccess,
    setTemplate
  } = useTemplate(id);


  const isCreatorOrAdmin = template && (
    user.role === 'admin' || 
    template.user?._id === user._id
  );

  useEffect(() => {
    if (template && !isCreatorOrAdmin) {
      navigate(`/template/${id}/submit`);
    }
  }, [template, isCreatorOrAdmin, id, navigate]);

  const getTabs = () => {
    if (isCreatorOrAdmin) {
      return [
        { id: 'general', label: 'General' },
        { id: 'questions', label: 'Questions' },
        { id: 'results', label: 'Results' },
        { id: 'aggregation', label: 'Aggregation' },
        { id: 'settings', label: 'Settings' }
      ];
    }
    return [
      { id: 'general', label: 'General' },
      { id: 'questions', label: 'Questions' }
    ];
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.deleteTemplate(id);
      navigate('/user');
    } catch (error) {
      console.error('Failed to delete template:', error);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleTemplateUpdate = (updatedTemplate) => {
    setTemplate(updatedTemplate);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <div className="template-details">
      <TemplateHeader 
        template={template} 
        onEdit={() => setIsEditing(true)}
        onDelete={() => setDeleteModalOpen(true)}
        showEditButton={isCreatorOrAdmin}
      />

      <DeleteTemplateModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      {isEditing ? (
        <EditTemplateForm 
          templateId={id} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <>
          <TemplateTabs
            activeTab={activeTab}
            tabs={getTabs()}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === "aggregation") {
                fetchAggregation();
              }
            }}
          />

          <div className="tab-content">
            {activeTab === "general" && (
              <GeneralSettings 
                template={template} 
                formsCount={forms.length}
                isCreatorOrAdmin={isCreatorOrAdmin}
              />
            )}
            {activeTab === "questions" && (
              <QuestionList
                questions={template.questions}
                isEditing={false}
                readOnly={!isCreatorOrAdmin}
              />
            )}
            {isCreatorOrAdmin && (
              <>
                {activeTab === "results" && <ResultsTable forms={forms} />}
                {activeTab === "aggregation" && (
                  <TemplateStats
                    data={aggregatedResults}
                    forms={forms}
                    template={template}
                  />
                )}
                {activeTab === "settings" && (
                  <TemplateSettings 
                    template={template}
                    onUpdate={handleTemplateUpdate}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateDetails;
