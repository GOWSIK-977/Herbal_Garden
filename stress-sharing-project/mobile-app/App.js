// App.js - MOBILE VERSION (FIXED)
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [onlineCount, setOnlineCount] = useState(42);

  // ✅ BACKEND URL - Change this to your actual backend URL
  // For development: http://YOUR_COMPUTER_IP:5000/api
  // For Expo web simulator: http://localhost:5000/api
  const API_URL = 'http://192.168.1.5:5000/api';

  // Mood options
  const moodOptions = [
    { emoji: '😭', label: 'Very Low', value: '1' },
    { emoji: '😔', label: 'Low', value: '2' },
    { emoji: '😐', label: 'Neutral', value: '3' },
    { emoji: '🙂', label: 'Okay', value: '4' },
    { emoji: '😊', label: 'Good', value: '5' }
  ];

  // Category options
  const categoryOptions = [
    { icon: 'school', label: 'Academic', value: 'Academic' },
    { icon: 'home', label: 'Family', value: 'Family' },
    { icon: 'briefcase', label: 'Career', value: 'Career' },
    { icon: 'person', label: 'Personal', value: 'Personal' },
    { icon: 'heart', label: 'Relationships', value: 'Relationships' },
    { icon: 'fitness', label: 'Health', value: 'Health' }
  ];

  // ✅ FIXED: Load posts from backend ONLY
  const loadPosts = async () => {
    try {
      setLoading(true);
      
      console.log('📱 Fetching posts from:', `${API_URL}/stress/all`);
      
      const response = await fetch(`${API_URL}/stress/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📱 Posts received:', data.length);
      
      // ✅ Data comes as array directly from /stress/all endpoint
      setPosts(data);
      
    } catch (error) {
      console.error('❌ Error loading posts:', error);
      
      // Fallback to empty array on error
      setPosts([]);
      
      // Show error only if not initial load
      if (posts.length === 0) {
        Alert.alert(
          'Connection Error', 
          'Cannot connect to server. Please make sure:\n1. Backend is running\n2. Correct IP address\n3. Same WiFi network',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ FIXED: Submit post - backend as single source of truth
  const submitPost = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please write your stress message');
      return;
    }
    
    if (!mood) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }
    
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setLoading(true);
      
      console.log('📱 Submitting post to:', `${API_URL}/stress/add`);
      
      const response = await fetch(`${API_URL}/stress/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: message.trim(), 
          mood, 
          category 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📱 Server response:', result);
      
      if (result.success) {
        Alert.alert('Success', result.message || 'Your stress has been shared anonymously!');
        
        // ✅ Clear form
        setMessage('');
        setMood('');
        setCategory('');
        
        // ✅ Reload fresh data from backend
        setTimeout(() => {
          loadPosts();
        }, 500);
        
      } else {
        Alert.alert('Error', result.message || 'Failed to share your stress');
      }
      
    } catch (error) {
      console.error('❌ Error submitting post:', error);
      Alert.alert(
        'Network Error', 
        'Cannot connect to server. Please check:\n1. Backend is running\n2. Internet connection\n3. Try again later'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add reaction to post
  const addReaction = async (postId, type) => {
    try {
      // ✅ First update UI optimistically
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  [type]: (post.reactions[type] || 0) + 1
                }
              }
            : post
        )
      );
      
      // ✅ Then send to backend (if you have this endpoint)
      // const response = await fetch(`${API_URL}/posts/${postId}/react`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reactionType: type })
      // });
      
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Revert UI on error if needed
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  // On refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  // Initial load
  useEffect(() => {
    loadPosts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadPosts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Render post item
  const renderPost = ({ item }) => {
    const moodEmoji = {
      '1': '😭', '2': '😔', '3': '😐', '4': '🙂', '5': '😊',
      'Anxious': '😰', 'Sad': '😔', 'Angry': '😠', 'Depressed': '😞'
    }[item.mood] || '😐';

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.anonymousAvatar}>
            <Text style={styles.avatarText}>
              {String.fromCharCode(65 + (item.id?.charCodeAt(0) || 0) % 26)}
            </Text>
          </View>
          <View style={styles.postMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category || 'Other'}</Text>
            </View>
            <Text style={styles.postTime}>
              {moodEmoji} • {formatTime(item.timestamp || item.createdAt)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.postMessage}>{item.message}</Text>
        
        <View style={styles.reactionContainer}>
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => addReaction(item.id || item._id, 'support')}
          >
            <Ionicons name="heart" size={18} color="#FF6B6B" />
            <Text style={styles.reactionText}>
              Support {item.reactions?.support || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => addReaction(item.id || item._id, 'empathy')}
          >
            <Ionicons name="hand-left" size={18} color="#4ECDC4" />
            <Text style={styles.reactionText}>
              Empathy {item.reactions?.empathy || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => addReaction(item.id || item._id, 'solidarity')}
          >
            <Ionicons name="fist" size={18} color="#45B7D1" />
            <Text style={styles.reactionText}>
              Solidarity {item.reactions?.solidarity || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#00E676']}
            tintColor="#00E676"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="heart-circle" size={32} color="#00E676" />
            <Text style={styles.logoText}>SafeSpace</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#00E676" />
              <Text style={styles.statText}>{onlineCount} online</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color="#FF6B6B" />
              <Text style={styles.statText}>
                {posts.reduce((sum, post) => sum + (post.reactions?.support || 0), 0)} supports
              </Text>
            </View>
          </View>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View>
            <Text style={styles.welcomeTitle}>You're Not Alone Today</Text>
            <Text style={styles.welcomeSubtitle}>
              Share your stress anonymously. No accounts. No judgment.
            </Text>
            <View style={styles.affirmation}>
              <Ionicons name="quote" size={16} color="#00E676" />
              <Text style={styles.affirmationText}>You are stronger than you think</Text>
            </View>
          </View>
          <View style={styles.pulseCircle}>
            <Ionicons name="hand-left" size={32} color="white" />
          </View>
        </View>

        {/* Create Post Card */}
        <View style={styles.createCard}>
          <Text style={styles.cardTitle}>
            <Ionicons name="create" size={20} color="#00E676" /> Share Your Stress
          </Text>
          
          {/* Message Input */}
          <Text style={styles.inputLabel}>What's on your mind?</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={4}
            placeholder="Type your stress here... (You're completely anonymous)"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            maxLength={500}
            editable={!loading}
          />
          <Text style={[
            styles.charCount, 
            message.length > 480 && { color: '#FF6B6B' }
          ]}>
            {500 - message.length} characters left
          </Text>

          {/* Mood Selection */}
          <Text style={styles.inputLabel}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.moodOption,
                  mood === option.value && styles.moodOptionSelected,
                  loading && styles.disabled
                ]}
                onPress={() => !loading && setMood(option.value)}
                disabled={loading}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category Selection */}
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.categoryOption,
                  category === option.value && styles.categoryOptionSelected,
                  loading && styles.disabled
                ]}
                onPress={() => !loading && setCategory(option.value)}
                disabled={loading}
              >
                <Ionicons 
                  name={option.icon} 
                  size={20} 
                  color={category === option.value ? "#00E676" : "#667eea"} 
                />
                <Text style={styles.categoryLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={submitPost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="paper-plane" size={20} color="white" />
                <Text style={styles.submitButtonText}>Share Anonymously</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.privacyNote}>
            <Ionicons name="lock-closed" size={14} color="#999" /> 
            Your post will be automatically deleted after 24 hours
          </Text>
        </View>

        {/* Community Wall Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="chatbubbles" size={20} color="#00E676" /> Community Support Wall
          </Text>
          <TouchableOpacity onPress={loadPosts} disabled={loading}>
            <Ionicons 
              name="refresh" 
              size={20} 
              color={loading ? "#666" : "#00E676"} 
              style={loading && { transform: [{ rotate: '360deg' }] }}
            />
          </TouchableOpacity>
        </View>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E676" />
            <Text style={styles.loadingText}>Loading community posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses" size={64} color="#666" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Be the first to share your stress!</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadPosts}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}

            scrollEnabled={false}
            style={styles.postsList}
            ListFooterComponent={
              <View style={styles.listFooter}>
                <Text style={styles.footerNote}>
                  Showing {posts.length} posts • Auto-refresh every 30s
                </Text>
              </View>
            }
          />
        )}

        {/* Support Resources */}
        <View style={styles.supportCard}>
          <Ionicons name="warning" size={32} color="#FF6B6B" />
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>Need Immediate Help?</Text>
            <Text style={styles.supportSubtitle}>
              If you're in crisis, please reach out:
            </Text>
            <TouchableOpacity style={styles.resourceButton}>
              <Ionicons name="call" size={16} color="#FF6B6B" />
              <Text style={styles.resourceText}>Crisis Helpline: 1-800-273-8255</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceButton}>
              <Ionicons name="chatbubble" size={16} color="#FF6B6B" />
              <Text style={styles.resourceText}>Crisis Text Line: HOME to 741741</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with <Ionicons name="heart" size={14} color="#FF6B6B" /> for mental health awareness
          </Text>
          <Text style={styles.serverStatus}>
            {loading ? '🔄 Connecting...' : '✅ Connected'} • Backend: {API_URL}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00E676',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  welcomeCard: {
    backgroundColor: 'rgba(102,126,234,0.2)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 15,
    maxWidth: 250,
  },
  affirmation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00E676',
  },
  affirmationText: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 14,
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00E676',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00E676',
    marginBottom: 20,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 5,
  },
  messageInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    backgroundColor: 'rgba(0,230,118,0.2)',
    borderColor: '#00E676',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodLabel: {
    color: 'white',
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryOption: {
    width: '31%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(102,126,234,0.2)',
    borderColor: '#667eea',
  },
  categoryLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#00E676',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#00c853',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  postsList: {
    paddingHorizontal: 20,
  },
  listFooter: {
    padding: 15,
    alignItems: 'center',
  },
  footerNote: {
    color: '#666',
    fontSize: 12,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  anonymousAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  postMeta: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0,230,118,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '500',
  },
  postTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 3,
  },
  postMessage: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  reactionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
  },
  reactionText: {
    color: 'white',
    fontSize: 12,
  },
  supportCard: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  supportText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  supportSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 10,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  resourceText: {
    color: 'white',
    fontSize: 13,
  },
  footer: {
    padding: 25,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  serverStatus: {
    color: '#666',
    fontSize: 10,
    marginTop: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});