package com.elitan.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to handle SPA routing by forwarding all non-API and non-file requests
 * to index.html so React Router can take over.
 */
@Controller
public class WebController {

    @GetMapping(value = {
        "/", 
        "/3d-designer/**", 
        "/shop/**", 
        "/products/**", 
        "/cart/**", 
        "/checkout/**", 
        "/profile/**",
        "/admin/**",
        "/login",
        "/register"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
