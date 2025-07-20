import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText, Typography, Divider, IconButton, Box, CircularProgress } from '@mui/material';
import { Send, ExpandMore, ExpandLess, Comment } from '@mui/icons-material';

const AnswerSection = ({ questionId }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnswers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/answers/${questionId}`, {
        withCredentials: true,
      });
      setAnswers(res.data.answers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setShowAnswers(prev => !prev);
    if (!showAnswers && answers.length === 0) fetchAnswers();
  };

  const handleSubmit = async () => {
    if (!newAnswer.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/answers`,
        {
          questionId,
          body: newAnswer,
        },
        { withCredentials: true }
      );
      setNewAnswer('');
      fetchAnswers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        startIcon={<Comment />}
        endIcon={showAnswers ? <ExpandLess /> : <ExpandMore />}
        onClick={handleToggle}
        color="primary"
        variant="outlined"
        size="small"
      >
        {answers.length > 0 ? `${answers.length} Comments` : 'Add Comment'}
      </Button>

      {showAnswers && (
        <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : answers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {answers.map((answer) => (
                <div key={answer._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={answer.user?.username || "Anonymous"} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight="medium">
                          {answer.user?.username || "Anonymous"}
                        </Typography>
                      }
                      secondary={answer.body}
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              variant="outlined"
              placeholder="Write your comment..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSubmit}
              disabled={!newAnswer.trim() || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AnswerSection;