import React, { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";

function Authentication() {
    const [tab, setTab] = useState(0);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { handleRegister, handleLogin } = useContext(AuthContext);

    const handleTabChange = (e, newValue) => setTab(newValue);

    const showSnackbar = (message, type = "info") => {
        alert(`${type.toUpperCase()}: ${message}`);
    };

    const handleAuth = async () => {
        setIsLoading(true);
        
        try {
            if (tab === 0) {
                // --- Login Logic ---
                await handleLogin(email, password);
                showSnackbar("Login successful!", "success");
            } else {
                // --- Signup Logic ---
                if (!role || !name || !username || !email || !password) {
                    setIsLoading(false); 
                    showSnackbar("Please fill all fields", "warning");
                    return;
                }

                const formData = new FormData();
                formData.append("name", name);
                formData.append("username", username);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("role", role);
                if (profilePhoto) {
                    formData.append("profilePhoto", profilePhoto);
                }

                const msg = await handleRegister(formData);
                showSnackbar(msg || "Registration successful! You can now log in.", "success");
            }
        } catch (error) {
            console.error("Auth error:", JSON.stringify(error, null, 2));
            let errMsg = "Something went wrong";
            if (error.response) {
                errMsg = error.response.data?.message || errMsg;
            } else if (error.request) {
                errMsg = "Network error: Unable to reach the server";
            } else {
                errMsg = error.message || errMsg;
            }
            showSnackbar(errMsg, "error");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography variant="h5" align="center" gutterBottom>
                        {tab === 0 ? "Login" : "Signup"}
                    </Typography>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        centered
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>

                    {tab === 0 ? (
                        // --- Login Form ---
                        <Box component="form" noValidate sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleAuth}
                                disabled={isLoading} 
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} /> 
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </Box>
                    ) : (
                        // --- Signup Form ---
                        <Box component="form" noValidate sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    value={role}
                                    label="Role"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <MenuItem value="recruiter">Recruiter</MenuItem>
                                    <MenuItem value="developer">Developer</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                component="label"
                                sx={{ mt: 2, mr: 2 }} 
                                disabled={isLoading}
                            >
                                Upload Profile Photo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                                />
                            </Button>
                            {/* Display uploaded file name */}
                            <Typography variant="body2" component="span">
                                {profilePhoto ? profilePhoto.name : 'No file chosen'}
                            </Typography>


                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleAuth}
                                disabled={isLoading} 
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} /> 
                                ) : (
                                    'Signup'
                                )}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default Authentication;